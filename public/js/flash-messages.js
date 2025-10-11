function handleRedirect(redirectUrl) {
    // Hide any existing redirect overlays
    const existingOverlay = document.querySelector('.redirect-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }

    // Create and show the redirect overlay
    const overlay = document.createElement('div');
    overlay.className = 'redirect-overlay';
    
    // After 1 second, redirect
    setTimeout(() => {
        window.location.href = redirectUrl;
    }, 1000);
}