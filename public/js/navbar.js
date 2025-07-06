
    document.addEventListener('DOMContentLoaded', function() {
        const hamburger = document.querySelector('.hamburger');
        const navMain = document.querySelector('.nav-main');

        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMain.classList.toggle('active');
        });
    });
