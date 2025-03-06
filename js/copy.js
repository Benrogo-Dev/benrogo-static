function copyCode(button) {
    const pre = button.previousElementSibling;
    const code = pre.querySelector('code').textContent;
    navigator.clipboard.writeText(code).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    });
}