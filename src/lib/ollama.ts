import { Ollama } from 'ollama'

export interface OllamaConfig {
  host?: string
  model: string
  timeout?: number
}

export class OllamaService {
  private client: Ollama
  private config: OllamaConfig

  constructor(config: OllamaConfig) {
    this.config = {
      host: config.host || 'http://localhost:11434',
      model: config.model,
      timeout: config.timeout || 120000 // 2 minutes default
    }
    this.client = new Ollama({ host: this.config.host })
  }

  async isModelAvailable(): Promise<boolean> {
    try {
      const models = await this.client.list()
      return models.models.some(model => model.name === this.config.model)
    } catch (error) {
      console.error('Failed to check model availability:', error)
      return false
    }
  }

  async pullModel(): Promise<void> {
    try {
      console.log(`Pulling model ${this.config.model}...`)
      await this.client.pull({ model: this.config.model })
      console.log('Model pulled successfully')
    } catch (error) {
      console.error('Failed to pull model:', error)
      throw error
    }
  }

  async generateResponse(prompt: string, systemPrompt?: string): Promise<string> {
    try {
      const isAvailable = await this.isModelAvailable()
      if (!isAvailable) {
        throw new Error(`Model ${this.config.model} is not available`)
      }

      const response = await this.client.generate({
        model: this.config.model,
        prompt: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt,
        system: systemPrompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_predict: 2000,
        }
      })

      return response.response
    } catch (error) {
      console.error('Ollama generation error:', error)
      throw error
    }
  }

  async generateChatResponse(messages: Array<{role: string, content: string}>): Promise<string> {
    try {
      const isAvailable = await this.isModelAvailable()
      if (!isAvailable) {
        throw new Error(`Model ${this.config.model} is not available`)
      }

      const response = await this.client.chat({
        model: this.config.model,
        messages: messages,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_predict: 2000,
        }
      })

      return response.message.content
    } catch (error) {
      console.error('Ollama chat error:', error)
      throw error
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.client.list()
      return true
    } catch (error) {
      console.error('Ollama connection test failed:', error)
      return false
    }
  }
}

// Singleton instance for the application
let ollamaService: OllamaService | null = null

export function getOllamaService(): OllamaService {
  if (!ollamaService) {
    ollamaService = new OllamaService({
      model: process.env.OLLAMA_MODEL || 'cniongolo/biomistral:latest',
      host: process.env.OLLAMA_HOST || 'http://localhost:11434',
      timeout: parseInt(process.env.OLLAMA_TIMEOUT || '120000')
    })
  }
  return ollamaService
}
