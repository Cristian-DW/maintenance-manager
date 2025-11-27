import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
    XMarkIcon,
    QrCodeIcon,
    ArrowDownTrayIcon,
    PrinterIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import api from '../../api';

export default function AssetQRGenerator({ asset, onClose, onGenerated }) {
    const [generating, setGenerating] = useState(false);
    const [qrCode, setQrCode] = useState(asset?.qrCode || null);
    const [error, setError] = useState(null);
    const qrRef = useRef(null);

    const generateQR = async () => {
        setGenerating(true);
        setError(null);

        try {
            // Generate unique QR code (UUID)
            const newQrCode = `ASSET-${asset.ID}-${Date.now()}`;

            // Update asset with QR code
            await api.patch(`/Assets('${asset.ID}')`, {
                qrCode: newQrCode
            });

            setQrCode(newQrCode);
            if (onGenerated) onGenerated(newQrCode);
        } catch (err) {
            console.error('Error generando QR:', err);
            setError('Error al generar el código QR');
        } finally {
            setGenerating(false);
        }
    };

    const downloadQR = () => {
        const svg = qrRef.current?.querySelector('svg');
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const pngFile = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = `QR-${asset.code}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };

    const printQR = () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        const svg = qrRef.current?.querySelector('svg');

        if (!svg) return;

        printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${asset.code}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
            }
            .qr-container {
              text-align: center;
              padding: 20px;
              border: 2px solid #000;
            }
            h1 { margin: 10px 0; font-size: 24px; }
            p { margin: 5px 0; color: #666; }
            @media print {
              body { height: auto; }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            ${svg.outerHTML}
            <h1>${asset.name}</h1>
            <p><strong>Código:</strong> ${asset.code}</p>
            <p><strong>Ubicación:</strong> ${asset.location}</p>
          </div>
        </body>
      </html>
    `);

        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 shadow-lg">
                            <QrCodeIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Código QR</h2>
                            <p className="text-sm text-gray-600">{asset.name}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <XMarkIcon className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                {/* Asset Info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <span className="text-gray-500">Código:</span>
                            <p className="font-medium text-gray-900">{asset.code}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Ubicación:</span>
                            <p className="font-medium text-gray-900">{asset.location}</p>
                        </div>
                    </div>
                </div>

                {/* QR Code Display */}
                {qrCode ? (
                    <div className="flex flex-col items-center space-y-4">
                        <div
                            ref={qrRef}
                            className="p-6 bg-white rounded-2xl border-2 border-gray-200 shadow-lg"
                        >
                            <QRCodeSVG
                                value={qrCode}
                                size={200}
                                level="H"
                                includeMargin={true}
                            />
                        </div>

                        <p className="text-xs text-gray-500 text-center px-4">
                            Escanea este código con la aplicación para acceder rápidamente a este activo
                        </p>

                        {/* Action Buttons */}
                        <div className="flex gap-2 w-full">
                            <button
                                onClick={downloadQR}
                                className="flex-1 btn btn-secondary btn-sm"
                            >
                                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                                Descargar
                            </button>
                            <button
                                onClick={printQR}
                                className="flex-1 btn btn-secondary btn-sm"
                            >
                                <PrinterIcon className="h-4 w-4 mr-2" />
                                Imprimir
                            </button>
                            <button
                                onClick={generateQR}
                                disabled={generating}
                                className="flex-1 btn btn-primary btn-sm"
                            >
                                <ArrowPathIcon className={`h-4 w-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
                                Regenerar
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <QrCodeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 mb-6">
                            Este activo aún no tiene un código QR asignado
                        </p>
                        <button
                            onClick={generateQR}
                            disabled={generating}
                            className="btn btn-primary"
                        >
                            {generating ? (
                                <>
                                    <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                                    Generando...
                                </>
                            ) : (
                                <>
                                    <QrCodeIcon className="h-5 w-5 mr-2" />
                                    Generar Código QR
                                </>
                            )}
                        </button>
                    </div>
                )}

                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
