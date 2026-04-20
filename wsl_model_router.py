#!/usr/bin/env python3
"""
wsl_model_router.py - Auto-detect models in WSL and route tasks appropriately
Usage: python3 wsl_model_router.py [task_type] [input]
  task_type: coding, medical, general
"""

import os
import sys
import subprocess
import json
import urllib.request
import glob
from pathlib import Path

# ============ HELPER FUNCTIONS FOR CODING REVIEW ============

def read_workflow():
    """Read the review workflow rules."""
    workflow_paths = [
        ".windsurf/workflows/review.md",
        "../.windsurf/workflows/review.md",
        "../../.windsurf/workflows/review.md",
    ]
    
    for path in workflow_paths:
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as f:
                return f.read()
    
    print("Warning: review.md workflow not found, using default rules")
    return """You are a senior software engineer performing a thorough code review.
Focus on: logic errors, edge cases, null references, race conditions, security vulnerabilities,
resource leaks, API contract violations, incorrect caching, performance issues,
error handling, hardcoded values, test coverage, documentation gaps."""

def get_project_files(project_path):
    """Get list of source files to analyze."""
    files = []
    extensions = ['*.ts', '*.tsx', '*.js', '*.jsx', '*.py', '*.prisma', '*.sql']
    
    for ext in extensions:
        files.extend(glob.glob(f"{project_path}/src/**/{ext}", recursive=True))
        files.extend(glob.glob(f"{project_path}/scripts/**/{ext}", recursive=True))
        files.extend(glob.glob(f"{project_path}/components/**/{ext}", recursive=True))
        files.extend(glob.glob(f"{project_path}/lib/**/{ext}", recursive=True))
        files.extend(glob.glob(f"{project_path}/app/**/{ext}", recursive=True))
    
    # Limit to first 50 files to avoid token limits
    return files[:50]

def read_file_snippets(files, max_total_chars=80000):  # Balanced: not too big, not too small
    """Read file contents with size limit."""
    snippets = []
    total = 0
    
    for i, f in enumerate(files):
        if i % 10 == 0:
            print(f"   📄 Reading file {i+1}/{len(files)}...", end="\r")
        try:
            with open(f, 'r', encoding='utf-8') as file:
                content = file.read()
                # Balanced truncation - keep more context
                if len(content) > 6000:
                    content = content[:3000] + "\n... [truncated] ...\n" + content[-3000:]
                
                snippet = f"\n=== {f} ===\n{content}\n"
                if total + len(snippet) > max_total_chars:
                    print(f"   ⚠️  Reached limit, skipping remaining {len(files) - i} files")
                    break
                
                snippets.append(snippet)
                total += len(snippet)
        except Exception as e:
            print(f"\n   Warning: Could not read {f}: {e}")
    
    print(f"   ✓ Processed {len(snippets)} files ({total} chars)")
    return ''.join(snippets)

def build_coding_prompt(workflow_content, file_snippets):
    """Build the coding review prompt."""
    return f"""You are a senior software engineer performing a thorough code review.

## REVIEW RULES - FOLLOW THESE STRICTLY:

{workflow_content}

---

## PROJECT CODE TO ANALYZE:

{file_snippets}

---

## YOUR TASK:

Analyze ALL the code above and provide a comprehensive report with:

1. **CRITICAL BUGS (P0)** - Fix immediately
   - List each bug with file path and line numbers
   - Show the buggy code and the fixed code

2. **SECURITY ISSUES (P0-P1)** - High priority
   - Vulnerabilities, injections, auth issues
   - Specific fixes with code

3. **PERFORMANCE ISSUES (P1-P2)**
   - Inefficient queries, loops, memory leaks
   - Optimized code solutions

4. **CODE QUALITY (P2-P3)**
   - Type safety, error handling, test coverage
   - Refactored code examples

5. **SUMMARY TABLE**
   | Issue | File | Line | Priority | Fix Complexity |

Be specific. Show actual code changes, not just descriptions."""

# ============ MODEL ROUTING CONFIGURATION ============
MODEL_ROUTES = {
    "coding": {
        "preferred": ["llama3.1", "codellama", "llama3", "llama2"],
        "fallback": "any_available"
    },
    "medical": {
        "preferred": ["medllama", "medalpaca", "biogpt", "llama3.1"],
        "fallback": "llama3.1"
    },
    "general": {
        "preferred": ["llama3.1", "llama3", "llama2"],
        "fallback": "any_available"
    }
}

class ModelRouter:
    def __init__(self):
        self.available_models = []
        self.ollama_available = False
        self.llamacpp_available = False
        self.api_endpoints = []
        
    def detect_models(self):
        """Detect all available models in WSL."""
        print("🔍 Detecting available models in WSL...")
        
        # 1. Check Ollama
        self._check_ollama()
        
        # 2. Check llama.cpp
        self._check_llamacpp()
        
        # 3. Check API endpoints
        self._check_api_endpoints()
        
        # 4. Check common model files
        self._check_model_files()
        
        print(f"\n✅ Found {len(self.available_models)} models:")
        for model in self.available_models:
            print(f"   - {model['name']} ({model['type']})")
        
        return self.available_models
    
    def _check_ollama(self):
        """Check if Ollama is running and list models."""
        # Try API first (fastest)
        try:
            req = urllib.request.Request("http://localhost:11434/api/tags", method="GET")
            with urllib.request.urlopen(req, timeout=2) as response:
                if response.status == 200:
                    data = json.loads(response.read().decode())
                    for model in data.get("models", []):
                        self.available_models.append({
                            "name": model["name"],
                            "type": "ollama",
                            "endpoint": "http://localhost:11434/api/generate"
                        })
                    self.ollama_available = True
                    print(f"   ✓ Ollama API found with {len(data.get('models', []))} models")
                    return  # Success, exit early
        except Exception as e:
            print(f"   ⚠ API check failed: {e}")
        
        # Fallback to CLI mode
        print("   🔧 Falling back to CLI mode...")
        try:
            result = subprocess.run(["which", "ollama"], capture_output=True, text=True)
            if result.returncode == 0:
                # Get models via CLI
                result = subprocess.run(["ollama", "list"], capture_output=True, text=True, timeout=10)
                if result.returncode == 0:
                    lines = result.stdout.strip().split("\n")
                    for line in lines[1:]:  # Skip header
                        if line.strip():
                            parts = line.split()
                            if parts:
                                model_name = parts[0]
                                self.available_models.append({
                                    "name": model_name,
                                    "type": "ollama",
                                    "endpoint": None  # Use CLI
                                })
                    self.ollama_available = True
                    print(f"   ✓ Ollama CLI found with {len(self.available_models)} models")
        except Exception as e:
            print(f"   ⚠ CLI check failed: {e}")
    
    def _check_llamacpp(self):
        """Check for llama.cpp installation."""
        llama_paths = [
            "/usr/local/bin/llama",
            "/usr/bin/llama",
            os.path.expanduser("~/llama.cpp/main"),
            os.path.expanduser("~/llama.cpp/llama-cli"),
        ]
        
        for path in llama_paths:
            if os.path.exists(path):
                self.llamacpp_available = True
                # Check for models in common directories
                model_dirs = [
                    os.path.expanduser("~/models"),
                    os.path.expanduser("~/llama.cpp/models"),
                    "/opt/models",
                ]
                
                for model_dir in model_dirs:
                    if os.path.exists(model_dir):
                        for model_file in Path(model_dir).glob("*.gguf"):
                            self.available_models.append({
                                "name": model_file.stem,
                                "type": "llamacpp",
                                "path": str(model_file),
                                "binary": path
                            })
                
                print(f"   ✓ llama.cpp found at {path}")
                break
    
    def _check_api_endpoints(self):
        """Check for other API endpoints."""
        endpoints = [
            ("http://localhost:8080", "generic_api"),
            ("http://localhost:5000", "flask_api"),
            ("http://localhost:8000", "fastapi"),
        ]
        
        for url, api_type in endpoints:
            try:
                req = urllib.request.Request(url, method="GET", timeout=1)
                with urllib.request.urlopen(req) as response:
                    if response.status == 200:
                        self.api_endpoints.append({"url": url, "type": api_type})
                        print(f"   ✓ API endpoint found: {url}")
            except:
                pass
    
    def _check_model_files(self):
        """Check for model files in common locations."""
        model_locations = [
            os.path.expanduser("~/.cache/llama"),
            os.path.expanduser("~/models"),
            "/mnt/c/models",
        ]
        
        for location in model_locations:
            if os.path.exists(location):
                for ext in [".gguf",".bin", ".ggml"]:
                    for model_file in Path(location).glob(f"**/*{ext}"):
                        if not any(m.get("path") == str(model_file) for m in self.available_models):
                            self.available_models.append({
                                "name": model_file.stem,
                                "type": "file",
                                "path": str(model_file)
                            })
    
    def select_model(self, task_type):
        """Select appropriate model for task type."""
        if not self.available_models:
            print("❌ No models detected!")
            return None
        
        route = MODEL_ROUTES.get(task_type, MODEL_ROUTES["general"])
        preferred = route["preferred"]
        
        # Try preferred models in order
        for pref_name in preferred:
            for model in self.available_models:
                if pref_name.lower() in model["name"].lower():
                    print(f"\n🎯 Selected '{model['name']}' for {task_type} task")
                    return model
        
        # Use fallback
        if route["fallback"] == "any_available":
            print(f"\n🎯 Using fallback model '{self.available_models[0]['name']}' for {task_type} task")
            return self.available_models[0]
        else:
            for model in self.available_models:
                if route["fallback"].lower() in model["name"].lower():
                    return model
            return self.available_models[0]
    
    def run_with_model(self, model, prompt):
        """Run prompt with selected model - always use CLI to avoid timeouts."""
        if model["type"] == "ollama":
            # Always use CLI mode - API is too slow for generation
            return self._run_ollama_cli(model, prompt)
        elif model["type"] == "llamacpp":
            return self._run_llamacpp(model, prompt)
        elif model["type"] == "file":
            print(f"⚠ Model file found but no runtime. Save prompt and run manually:")
            print(f"   Model: {model['path']}")
            return self._save_prompt(prompt)
    
    def _run_ollama_api(self, model, prompt):
        """Run via Ollama HTTP API with timeout."""
        data = json.dumps({
            "model": model["name"],
            "prompt": prompt,
            "stream": False,
            "options": {
                "num_ctx": 8192,
                "temperature": 0.7  # Default for good balance of creativity and accuracy
            }
        }).encode()
        
        req = urllib.request.Request(
            model["endpoint"],
            data=data,
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        
        print("   ⏳ Sending to model (this may take 30-60 seconds)...")
        print("   💡 Press Ctrl+C to cancel")
        
        try:
            # Add 120 second timeout
            with urllib.request.urlopen(req, timeout=120) as response:
                result = json.loads(response.read().decode())
                return result.get("response", "")
        except urllib.error.URLError as e:
            print(f"❌ Connection error: {e}")
            print("   Is Ollama running? Check: systemctl status ollama")
            return None
        except TimeoutError:
            print("❌ Request timed out after 120 seconds")
            print("   Try: ollama run llama3:latest directly")
            return None
        except Exception as e:
            print(f"❌ API Error: {e}")
            return None
    
    def _run_ollama_cli(self, model, prompt):
        """Run via Ollama CLI."""
        try:
            result = subprocess.run(
                ["ollama", "run", model["name"]],
                input=prompt,
                text=True,
                capture_output=True,
                timeout=300
            )
            if result.returncode == 0:
                return result.stdout
            else:
                print(f"❌ Ollama error: {result.stderr}")
                return None
        except subprocess.TimeoutExpired:
            print("❌ Request timed out")
            return None
    
    def _run_llamacpp(self, model, prompt):
        """Run via llama.cpp."""
        cmd = [
            model["binary"],
            "-m", model["path"],
            "-p", prompt,
            "-n", "4096",  # max tokens
        ]
        
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
            if result.returncode == 0:
                return result.stdout
            else:
                print(f"❌ llama.cpp error: {result.stderr}")
                return None
        except Exception as e:
            print(f"❌ Error running llama.cpp: {e}")
            return None
    
    def _save_prompt(self, prompt):
        """Save prompt to file for manual use."""
        prompt_path = "/tmp/model_prompt.txt"
        with open(prompt_path, 'w', encoding='utf-8') as f:
            f.write(prompt)
        print(f"\n💾 Prompt saved to: {prompt_path}")
        print(f"   Size: {len(prompt)} characters")
        return None

def main():
    # Default to coding review
    task_type = sys.argv[1] if len(sys.argv) > 1 else "coding"
    project_path = sys.argv[2] if len(sys.argv) > 2 else "."
    
    # Validate task type
    if task_type not in MODEL_ROUTES:
        print(f"Unknown task type: {task_type}")
        print(f"Valid types: {', '.join(MODEL_ROUTES.keys())}")
        sys.exit(1)
    
    # Initialize router
    router = ModelRouter()
    
    # Detect available models
    models = router.detect_models()
    
    if not models:
        print("\n❌ No models found. Please install a model:")
        print("   • Ollama: curl -fsSL https://ollama.com/install.sh | sh")
        print("   • Then: ollama pull llama3.1")
        print("   • Or: ollama pull codellama")
        sys.exit(1)
    
    # Select model for task
    model = router.select_model(task_type)
    
    if not model:
        sys.exit(1)
    
    # Build prompt based on task type
    if task_type == "coding":
        print("\n📁 Reading project files...")
        workflow = read_workflow()
        files = get_project_files(project_path)
        snippets = read_file_snippets(files)
        prompt = build_coding_prompt(workflow, snippets)
    elif task_type == "medical":
        prompt = build_medical_prompt(project_path)
    else:
        prompt = build_general_prompt(project_path)
    
    print(f"\n🚀 Running {task_type} analysis with {model['name']}...")
    result = router.run_with_model(model, prompt)
    
    if result:
        print("\n" + "="*60)
        print("RESULT:")
        print("="*60)
        print(result)

def build_medical_prompt(project_path):
    """Build prompt for medical content analysis."""
    return f"""You are a medical AI assistant reviewing healthcare content.

Analyze the medical/pharmacy project at: {project_path}

Focus on:
1. Clinical data accuracy and validity
2. Drug interaction checking logic
3. Patient safety considerations
4. Medical terminology correctness
5. Regulatory compliance (FDA, HIPAA)
6. Prescription validation logic
7. Dosage calculation accuracy
8. Contraindication detection

Provide specific recommendations for improving medical accuracy and patient safety.
"""

def build_general_prompt(project_path):
    """Build prompt for general analysis."""
    return f"""Analyze the project at: {project_path}

Provide a comprehensive overview including:
1. Project structure and architecture
2. Code quality assessment
3. Potential improvements
4. Security considerations
5. Performance observations
"""

if __name__ == "__main__":
    main()
