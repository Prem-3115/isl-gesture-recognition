import { useState, useRef, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router';
import { Button } from '../ui/button';
import { Camera, Video, VideoOff, Scan, Activity } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { useGestureRecognition } from '../../hooks/useGestureRecognition';
import islChart from '../../assets/isl_chart.jpg';

interface ContextType {
  onNavigate: (page: string) => void;
}

export function PracticePage() {
  const { onNavigate } = useOutletContext<ContextType>();

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  // ── Check Flask API status every 5 seconds ─────────────────────────────────
  useEffect(() => {
    const checkAPI = async () => {
      try {
        await fetch('http://127.0.0.1:5000/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ landmarks: new Array(63).fill(0) }),
        });
        setApiOnline(true);
      } catch {
        setApiOnline(false);
      }
    };
    checkAPI();
    const interval = setInterval(checkAPI, 5000);
    return () => clearInterval(interval);
  }, []);

  // ── Gesture recognition hook ───────────────────────────────────────────────
  const gestureResult = useGestureRecognition({
    videoRef,
    enabled: cameraActive,
  });

  // ── Camera controls ────────────────────────────────────────────────────────
  const startCamera = async () => {
    try {
      setCameraError(null);
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError('Camera not supported in this browser.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (!videoRef.current) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      videoRef.current.load();
      setTimeout(async () => {
        try {
          if (videoRef.current) {
            await videoRef.current.play();
            setCameraActive(true);
          }
        } catch (playErr: any) {
          setCameraError(`Play failed: ${playErr.name}`);
          stream.getTracks().forEach(track => track.stop());
        }
      }, 200);
    } catch (err: any) {
      if (err.name === 'NotAllowedError') setCameraError('❌ Permission denied. Check browser camera permissions.');
      else if (err.name === 'NotFoundError') setCameraError('❌ No camera found.');
      else if (err.name === 'NotReadableError') setCameraError('❌ Camera is in use by another app.');
      else setCameraError('❌ Error: ' + err.message);
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const detectedSign = gestureResult.detectedSign;
  const confidence = Math.round((gestureResult.confidence ?? 0) * 100);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">ISL Gesture Recognition</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Use your camera to show Indian Sign Language gestures and see real-time recognition results.
          </p>
        </div>

        {/* Flask API status */}
        {apiOnline === false && (
          <Alert className="mb-4 border-destructive bg-destructive/5">
            <Activity className="h-4 w-4 text-destructive" />
            <AlertDescription>
              <strong>Flask API is offline!</strong> Open a new terminal and run:{' '}
              <code className="bg-muted px-2 py-0.5 rounded text-xs">
                py -3.11 C:\Users\Prem\Downloads\isl_api.py
              </code>
            </AlertDescription>
          </Alert>
        )}
        {apiOnline === true && (
          <Alert className="mb-4 border-green-500 bg-green-500/5">
            <Activity className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-700">
              <strong>✅ Flask API is online</strong> — Ready for gesture recognition!
            </AlertDescription>
          </Alert>
        )}

        {/* Camera error */}
        {cameraError && (
          <Alert className="mb-4 border-accent bg-accent/5">
            <Camera className="h-4 w-4 text-accent" />
            <AlertDescription className="space-y-2">
              <p>{cameraError}</p>
              <Button onClick={startCamera} size="sm" variant="outline">
                <Camera className="w-4 h-4 mr-2" /> Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* AI loading */}
        {cameraActive && gestureResult.status === 'loading' && (
          <Alert className="mb-4 border-primary bg-primary/5">
            <Scan className="h-4 w-4 text-primary animate-spin" />
            <AlertDescription>
              Loading AI model — this may take 5–10 seconds on first launch...
            </AlertDescription>
          </Alert>
        )}

        {/* ── Main 2-column layout ── */}
        <div className="grid lg:grid-cols-3 gap-6 items-start">

          {/* ── LEFT: Camera + Stop + Tips + ISL Chart ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Camera */}
            <div
              className="bg-black rounded-xl overflow-hidden relative shadow-xl"
              style={{ aspectRatio: '16/9' }}
            >
              <video
                ref={videoRef}
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
              />

              {/* Inactive placeholder */}
              {!cameraActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-center text-white max-w-sm px-4">
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Camera Inactive</p>
                    <p className="text-sm opacity-70 mb-6">
                      Click below to start real-time ISL gesture recognition
                    </p>
                    <Button onClick={startCamera} size="lg" className="w-full bg-primary hover:bg-primary/90">
                      <Video className="w-5 h-5 mr-2" />
                      Start Camera
                    </Button>
                  </div>
                </div>
              )}

              {/* Hand guide overlay */}
              {cameraActive && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className={`relative border-2 border-dashed rounded-xl w-3/4 h-3/4 transition-all duration-300 ${
                    gestureResult.handDetected
                      ? 'border-secondary shadow-[0_0_20px_rgba(236,72,153,0.4)]'
                      : 'border-white/30'
                  }`}>
                    {gestureResult.handDetected && (
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-secondary text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 whitespace-nowrap">
                        <Scan className="w-3 h-3" />
                        Hand Detected
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* AI status badge */}
              {cameraActive && (
                <div className="absolute top-3 right-3 z-10">
                  <div className="bg-black/80 rounded-lg px-2 py-1.5 flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      gestureResult.status === 'loading' ? 'bg-yellow-400 animate-pulse' :
                      gestureResult.status === 'feedback' ? 'bg-green-400 animate-pulse' :
                      'bg-gray-400'
                    }`} />
                    <span className="text-white text-xs whitespace-nowrap">
                      {gestureResult.status === 'loading' ? 'Loading AI...' :
                       gestureResult.status === 'feedback' ? 'AI Active' :
                       gestureResult.status === 'detecting' ? 'Detecting...' : 'Ready'}
                    </span>
                  </div>
                </div>
              )}

              {/* Feedback overlay */}
              {cameraActive && gestureResult.status !== 'loading' && (
                <div className="absolute top-3 left-3 z-10" style={{ right: '110px' }}>
                  <div className="px-3 py-1.5 rounded-lg text-white text-xs bg-black/80 truncate">
                    {gestureResult.feedback}
                  </div>
                </div>
              )}
            </div>

            {/* Stop button — outside video div */}
            {cameraActive && (
              <div className="flex justify-center">
                <Button variant="destructive" size="sm" onClick={stopCamera}>
                  <VideoOff className="w-4 h-4 mr-2" />
                  Stop Camera
                </Button>
              </div>
            )}

            {/* Tips */}
            <div className="bg-card rounded-xl border p-4 shadow-sm">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Scan className="w-4 h-4 text-primary" />
                Tips for Better Recognition
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Good lighting — no shadows on your hand</li>
                <li>• Keep hand centered in the dashed box</li>
                <li>• Hold each sign steady for 2–3 seconds</li>
                <li>• Plain background works best</li>
                <li>• Make sure Flask API is running before starting</li>
              </ul>
            </div>

            {/* ISL Chart — collapsible */}
            <details className="bg-card rounded-xl border shadow-sm">
              <summary className="cursor-pointer px-4 py-3 text-sm font-medium flex items-center gap-2 select-none">
                <span>📖</span>
                <span>View ISL Alphabet &amp; Number Chart</span>
              </summary>
              <div className="px-4 pb-4">
                <p className="text-xs text-muted-foreground mb-3">
                  Match your hand gesture with this ISL reference chart.
                </p>
                <div className="overflow-hidden rounded-lg border">
                  <img
                    src={islChart}
                    alt="ISL Alphabet and Number Chart"
                    className="w-full object-contain bg-white"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Source: Indian Sign Language Research &amp; Training Centre (ISLRTC)
                </p>
              </div>
            </details>

          </div>

          {/* ── RIGHT: Detected Sign + System Status + About ISL ── */}
          <div className="space-y-4">

            {/* Detected Sign */}
            <div className="bg-card rounded-xl border p-6 shadow-sm text-center">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Detected Sign</h3>
              <div className={`w-28 h-28 rounded-2xl mx-auto mb-4 flex items-center justify-center font-bold transition-all duration-300 ${
                detectedSign
                  ? 'bg-gradient-to-br from-primary/20 to-secondary/20 text-5xl scale-110 shadow-lg'
                  : 'bg-muted text-muted-foreground text-4xl'
              }`}>
                {detectedSign ?? '?'}
              </div>
              <p className={`text-sm font-medium ${detectedSign ? 'text-primary' : 'text-muted-foreground'}`}>
                {detectedSign ? `"${detectedSign}" recognized!` : 'Show a hand sign to the camera'}
              </p>
              {detectedSign && confidence > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Confidence</span>
                    <span>{confidence}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        confidence >= 80 ? 'bg-green-500' :
                        confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${confidence}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* System Status */}
            <div className="bg-card rounded-xl border p-4 shadow-sm">
              <h4 className="text-sm font-medium mb-3">System Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Camera</span>
                  <span className={cameraActive ? 'text-green-500 font-medium' : 'text-muted-foreground'}>
                    {cameraActive ? '● Active' : '○ Inactive'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">AI Model</span>
                  <span className={
                    gestureResult.status === 'loading' ? 'text-yellow-500' :
                    gestureResult.status === 'idle' ? 'text-muted-foreground' :
                    'text-green-500 font-medium'
                  }>
                    {gestureResult.status === 'loading' ? '⟳ Loading' :
                     gestureResult.status === 'idle' ? '○ Idle' : '● Ready'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Flask API</span>
                  <span className={
                    apiOnline === null ? 'text-yellow-500' :
                    apiOnline ? 'text-green-500 font-medium' : 'text-destructive font-medium'
                  }>
                    {apiOnline === null ? '⟳ Checking...' :
                     apiOnline ? '● Online' : '✗ Offline'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Hand</span>
                  <span className={gestureResult.handDetected ? 'text-green-500 font-medium' : 'text-muted-foreground'}>
                    {gestureResult.handDetected ? '● Detected' : '○ Not detected'}
                  </span>
                </div>
              </div>
            </div>

            {/* About ISL */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <h4 className="text-sm font-medium text-primary mb-2">About ISL</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Trained on the Kaggle ISL dataset using MediaPipe hand landmarks
                + ML classification. Recognizes ISL alphabets and numbers in real time.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}