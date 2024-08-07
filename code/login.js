document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const defaultEmail = 'admin@cathaybk.com.tw';
    const defaultPassword = '111111';

    if (email === defaultEmail && password === defaultPassword) {
        window.location.href = 'branch.html';
    } else {
        const errorMessage = document.getElementById('error-message');
        errorMessage.style.display = 'block';
    }
});

document.getElementById('email').addEventListener('input', function() {
    const errorMessage = document.getElementById('error-message');
    errorMessage.style.display = 'none';
});

document.getElementById('password').addEventListener('input', function() {
    const errorMessage = document.getElementById('error-message');
    errorMessage.style.display = 'none';
});