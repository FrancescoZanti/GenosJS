document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('url-input');
    const logoInput = document.getElementById('logo-input'); // input file per il logo
    const generateButton = document.getElementById('generate-button');
    const downloadPdfButton = document.getElementById('download-pdf');
    const stickerContainer = document.getElementById('sticker-container');

    generateButton.addEventListener('click', async () => {
        const urls = urlInput.value.split('\n').filter(url => url.trim() !== '');
        stickerContainer.innerHTML = ''; // Pulisce gli adesivi precedenti

        // Se è stato caricato un file, lo legge, altrimenti usa la path di default
        let logoDataURL;
        if (logoInput.files && logoInput.files.length > 0) {
            try {
                logoDataURL = await readUploadedLogo(logoInput.files[0]);
            } catch (error) {
                console.error('Errore nel caricamento del logo caricato:', error);
                // In caso di errore, usa l'immagine di default
                logoDataURL = '../assets/logo.png';
            }
        } else {
            logoDataURL = '../assets/logo.png';
        }

        urls.forEach(url => {
            const stickerDiv = document.createElement('div');
            stickerDiv.className = 'sticker';

            const logoImg = document.createElement('img');
            // Assicura che il path sia corretto in base alla struttura del progetto
            logoImg.src = 'assets/logo.png';
            logoImg.alt = 'Logo';
            stickerDiv.appendChild(logoImg);

            const qrCodeCanvas = document.createElement('canvas');
            QRCode.toCanvas(qrCodeCanvas, url, { errorCorrectionLevel: 'H' }, (error) => {
                if (error) console.error(error);
                stickerDiv.appendChild(qrCodeCanvas);
            });

            stickerContainer.appendChild(stickerDiv);
        });
    });

    // Funzione di supporto per caricare un'immagine come DataURL (default)
    function loadImageAsDataURL(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = reject;
            img.src = src;
        });
    }

    // Funzione per leggere il file caricato dall'utente come DataURL
    function readUploadedLogo(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Funzione per generare QRCode come DataURL
    function generateQRCodeDataURL(text) {
        return new Promise((resolve, reject) => {
            QRCode.toDataURL(text, { errorCorrectionLevel: 'H' }, (error, urlData) => {
                if (error) reject(error);
                else resolve(urlData);
            });
        });
    }

    downloadPdfButton.addEventListener('click', async () => {
        const urls = urlInput.value.split('\n').filter(url => url.trim() !== '');
        if (urls.length === 0) return;

        let logoDataURL;
        try {
            logoDataURL = await loadImageAsDataURL('assets/logo.png');
        } catch (error) {
            console.error('Errore nel caricamento del logo:', error);
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            unit: 'mm',
            format: 'a4'
        });

        // Sticker A6: 105 x 148 mm, diviso verticalmente per logo e QR code
        const stickerWidth = 105;
        const stickerHeight = 148;
        const positions = [
            { x: 0, y: 0 },
            { x: stickerWidth, y: 0 },
            { x: 0, y: stickerHeight },
            { x: stickerWidth, y: stickerHeight }
        ];

        const padding = 5;
        const gap = 5;
        const availableHeight = stickerHeight - 2 * padding;
        const elementHeight = (availableHeight - gap) / 2;
        const elementWidth = stickerWidth - 2 * padding;

        let stickerCount = 0;
        for (let i = 0; i < urls.length; i++) {
            if (stickerCount > 0 && stickerCount % 4 === 0) {
                doc.addPage();
            }
            const pos = positions[stickerCount % 4];

            let qrDataURL;
            try {
                qrDataURL = await generateQRCodeDataURL(urls[i]);
            } catch (error) {
                console.error('Errore nella generazione del QRCode per', urls[i], error);
                continue;
            }

            // Aggiunge il logo nella parte superiore dello sticker
            const logoX = pos.x + padding;
            const logoY = pos.y + padding;
            doc.addImage(logoDataURL, logoFormat, logoX, logoY, elementWidth, elementHeight);

            // Aggiunge il QR code subito sotto il logo (il QR è in PNG)
            const qrX = pos.x + padding;
            const qrY = logoY + elementHeight + gap;
            doc.addImage(qrDataURL, 'PNG', qrX, qrY, elementWidth, elementHeight);

            // Disegna il rettangolo tratteggiato per le linee di taglio
            doc.setLineDash([2, 2]);
            doc.setDrawColor(150);
            doc.rect(pos.x, pos.y, stickerWidth, stickerHeight);

            stickerCount++;
        }
        doc.save('adesivi.pdf');
    });
});