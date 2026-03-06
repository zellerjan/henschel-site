document.addEventListener('DOMContentLoaded', () => {
    
    // Selektiere alle Burger-Icons und Links in der Navigation
    const navTriggers = document.querySelectorAll('.nav-burger, nav a');
    const header = document.querySelector('header');

    navTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            header.classList.toggle('expanded');
        });
    });

});