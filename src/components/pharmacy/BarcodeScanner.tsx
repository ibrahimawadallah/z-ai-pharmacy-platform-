'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Scan, ScanLine, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface BarcodeScannerProps {
  onScan: (barcode: string) => void
  onError?: (error: string) => void
}

export function BarcodeScanner({ onScan, onError }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [hasCamera, setHasCamera] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanningRef = useRef(false)
  const detectBarcodeRef = useRef<(() => void) | null>(null)

  const stopScanning = useCallback(() => {
    scanningRef.current = false
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }, [])

  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [stopScanning])

  const detectBarcode = useCallback(async () => {
    if (!scanningRef.current || !videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
      if (scanningRef.current && detectBarcodeRef.current) {
        requestAnimationFrame(detectBarcodeRef.current)
      }
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    if ('BarcodeDetector' in window) {
      try {
        const detector = new (window as unknown as { BarcodeDetector: new (formats: string[]) => { detect: (image: ImageBitmapSource) => Promise<Array<{ rawValue: string }>> } }).BarcodeDetector(['ean_13', 'ean_8', 'code_128', 'upc_a'])
        const barcodes = await detector.detect(canvas)
        
        if (barcodes.length > 0) {
          const barcode = barcodes[0].rawValue
          onScan(barcode)
          stopScanning()
          return
        }
      } catch {
        // Continue scanning
      }
    }

    if (scanningRef.current && detectBarcodeRef.current) {
      requestAnimationFrame(detectBarcodeRef.current)
    }
  }, [onScan, stopScanning])

  // Store detectBarcode in ref to avoid circular dependency
  useEffect(() => {
    detectBarcodeRef.current = detectBarcode
  }, [detectBarcode])

  const startScanning = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        scanningRef.current = true
        setIsScanning(true)
        setHasCamera(true)
        
        if (detectBarcodeRef.current) {
          requestAnimationFrame(detectBarcodeRef.current)
        }
      }
    } catch (error) {
      setHasCamera(false)
      onError?.('Camera access denied or not available')
    }
  }, [onError])

  const handleManualInput = () => {
    const code = prompt('Enter barcode or drug code:')
    if (code) {
      onScan(code)
    }
  }

  if (!hasCamera) {
    return (
      <Card className="p-6 bg-amber-50 border-amber-200">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="h-12 w-12 text-amber-500" />
          <div>
            <h3 className="font-semibold text-amber-900">Camera Not Available</h3>
            <p className="text-sm text-amber-700 mt-1">
              Use manual entry or try a device with camera access
            </p>
          </div>
          <Button onClick={handleManualInput} variant="outline">
            Enter Code Manually
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {isScanning ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-64 object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Scanner overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 border-2 border-white rounded-lg">
                <ScanLine className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 text-white animate-pulse" />
                <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-blue-500" />
                <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-blue-500" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-blue-500" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-blue-500" />
              </div>
            </div>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <Button onClick={stopScanning} variant="destructive" size="sm">
                Stop Scanning
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-gray-100">
            <Scan className="h-16 w-16 text-gray-400 mb-4" />
            <div className="flex gap-2">
              <Button onClick={startScanning} size="lg">
                Start Camera Scan
              </Button>
              <Button onClick={handleManualInput} variant="outline" size="lg">
                Manual Entry
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

// Type declaration for BarcodeDetector API
declare global {
  interface Window {
    BarcodeDetector?: new (formats: string[]) => {
      detect: (image: ImageBitmapSource) => Promise<Array<{ rawValue: string }>>
    }
  }
}
