import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { XMarkIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

export default function AssetQRScanner({ onClose }) {
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!scanning) return;

        const scanner = new Html5QrcodeScanner(
            'qr-reader',
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
            },
            false
        );

        scanner.render(onScanSuccess, onScanFailure);

        async function onScanSuccess(decodedText) {
            setSuccess(`QR Code escaneado: ${decodedText}`);
            scanner.clear();
            setScanning(false);

            try {
                // Search for asset by QR code
                const response = await api.get(`/Assets?$filter=qrCode eq '${decodedText}'`);
                const assets = response.data?.value || response.data || [];

                if (assets.length > 0) {
                    const asset = assets[0];
                    // Redirect to asset detail or create request
                    navigate(`/assets?highlight=${asset.ID}`);
                    if (onClose) onClose();
                } else {
                    setError('No se encontró ningún activo con este código QR');
                }
            } catch (err) {
                console.error('Error buscando activo:', err);
                setError('Error al buscar el activo');
            }
        }

        function onScanFailure(error) {
            // Silent fail - normal cuando no hay QR en el frame
        }

        return () => {
            scanner.clear().catch(console.error);
        };
    }, [scanning, navigate, onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 shadow-lg">
                            <QrCodeIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Escanear QR</h2>
                            <p className="text-sm text-gray-600">Apunta la cámara al código QR del activo</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <XMarkIcon className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                {/* Scanner Area */}
                {!scanning ? (
                    <div className="text-center py-12">
                        <button
                            onClick={() => {
                                setScanning(true);
                                setError(null);
                                setSuccess(null);
                            }}
                            className="btn btn-primary btn-lg"
                        >
                            <QrCodeIcon className="h-6 w-6 mr-2" />
                            Activar Cámara
                        </button>
                        <p className="mt-4 text-sm text-gray-500">
                            Haz clic para activar la cámara y escanear el código QR
                        </p>
                    </div>
                ) : (
                    <div id="qr-reader" className="rounded-xl overflow-hidden"></div>
                )}

                {/* Messages */}
                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                        <p className="text-sm text-green-700">{success}</p>
                    </div>
                )}

                {/* Instructions */}
                {scanning && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-sm text-blue-700">
                            💡 Mantén el código QR dentro del recuadro y espera a que se escanee automáticamente
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
