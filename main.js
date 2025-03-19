$(document).ready(function() {
    let currentType = 'url';
    let qrcode = null;
    
    // Type selection
    $('[data-type]').click(function() {
        currentType = $(this).data('type');
        $('[data-type]').removeClass('bg-opacity-100').addClass('bg-opacity-50');
        $(this).removeClass('bg-opacity-50').addClass('bg-opacity-100');
        
        const placeholders = {
            'url': 'Enter URL (e.g., https://example.com)',
            'text': 'Enter your text message',
            'email': 'Enter email address'
        };
        $('#qr-input').attr('placeholder', placeholders[currentType]);
    });

    // Generate QR Code
    function generateQR() {
        const inputText = $('#qr-input').val().trim();
        $('#error-message').text('');

        if (inputText === '') {
            $('#error-message').text('Please enter some content');
            return;
        }

        let finalText = inputText;
        if (currentType === 'email') {
            if (!inputText.includes('@')) {
                $('#error-message').text('Please enter a valid email address');
                return;
            }
            finalText = 'mailto:' + inputText;
        } else if (currentType === 'url' && !inputText.startsWith('http')) {
            finalText = 'https://' + inputText;
        }

        // Clear previous QR code
        $('#qrcode').empty();

        // Get customization values
        const size = parseInt($('#size').val()) || 200;
        const fgColor = $('#fg-color').val() || '#581c87';
        const bgColor = $('#bg-color').val() || '#FFFFFF';

        try {
            // Generate QR code
            qrcode = new QRCode(document.getElementById("qrcode"), {
                text: finalText,
                width: size,
                height: size,
                colorDark: fgColor,
                colorLight: bgColor,
                correctLevel: QRCode.CorrectLevel.H,
                quietZone: 10,
                quietZoneColor: bgColor,
                logo: null,
                title: null,
                titleFont: "normal normal bold 16px Arial",
                titleColor: "#000000",
                titleBackgroundColor: "#ffffff",
                titleHeight: 0,
                titleTop: 20
            });

            // Show download button
            $('#download-btn').removeClass('hidden');
        } catch (error) {
            $('#error-message').text('Error generating QR code');
            console.error(error);
        }
    }

    // Event listeners
    $('#generate-btn').click(generateQR);
    
    $('#qr-input').keypress(function(e) {
        if (e.which === 13) { // Enter key
            generateQR();
        }
    });

    $('#fg-color, #bg-color, #size').on('input', function() {
        if ($('#qr-input').val().trim() !== '') {
            generateQR();
        }
    });

    $('#clear-btn').click(function() {
        $('#qr-input').val('');
        $('#qrcode').empty();
        $('#download-btn').addClass('hidden');
        $('#error-message').text('');
        $('#fg-color').val('#581c87');
        $('#bg-color').val('#FFFFFF');
        $('#size').val(200);
        $('[data-type]').removeClass('bg-opacity-100').addClass('bg-opacity-50');
        $('[data-type="url"]').addClass('bg-opacity-100').removeClass('bg-opacity-50');
        currentType = 'url';
    });

    $('#download-btn').click(function() {
        const canvas = $('#qrcode canvas')[0];
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'qrcode.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    });

    $('[data-type="url"]').addClass('bg-opacity-100').removeClass('bg-opacity-50');
});