import { Html5Qrcode, QrcodeErrorCallback, QrcodeSuccessCallback } from "html5-qrcode";
import { QrDimensionFunction, QrDimensions } from "html5-qrcode/esm/core";
import { useState, useEffect, useRef } from "react";

type QrScannerProps = {
  onSuccess: QrcodeSuccessCallback;
  onError?: QrcodeErrorCallback;
  fps?: number;
  qrbox?: number;
  aspectRatio?: number;
  disableFlip?: boolean;
  verbose?: boolean;
  className?: string;
};

const regionId = 'qr-scanner-full-region';
const getQrBox = ((width: number, height: number) => {
  const min = Math.min(width, height);
  return { width: 0.9 * min, height: 0.9 * min } as QrDimensions
}) as QrDimensionFunction;

const delay = (ms: number) => (new Promise(resolve => setTimeout(resolve, ms)));

export default function QrScanner( props: QrScannerProps ) {
  const scannerConfig = {
    fps: props.fps,
    qrbox: getQrBox,
    aspectRatio: props.aspectRatio,
    disableFlip: props.disableFlip
  };
  const verbose = props.verbose === true;
  if (!(props.onSuccess)) {
    throw 'A success callback is necessary.';
  }

  const scannerRef = useRef<Html5Qrcode | undefined>(undefined);

  async function stopScanner(scanner: Html5Qrcode) {
    const delayTime = 200; // ms
    const maxRetries = 50; // 10 seconds

    for (let i = 0; i < maxRetries; ++i) {
      try {
        scanner.stop();
        break;
      } catch(error) {
        console.log('Failed to stop scanner.');
        await delay(delayTime);
      }
    }
  }

  async function createScanner() {
    if (!!scannerRef.current) {
      await stopScanner(scannerRef.current);
    }
    scannerRef.current = new Html5Qrcode(regionId);
    scannerRef.current.start({ facingMode: 'environment' }, scannerConfig, props.onSuccess, props.onError);
  }

  useEffect(() => {
    createScanner();
  }, [props]);

  return (
    <div
      id={regionId}
      className={props.className}
    />
  );
};