# 🚂 Responsive Design Modul
This project was created over 4 days in the Module Responsive Design at the SfGZ.

## The Task
> [!Note]
> The task for this SfGZ module was to transform a randomly assigned Wikipedia article into a modern, responsive OnePager. I was assigned the [Henschel DHG 700C](https://de.wikipedia.org/wiki/Henschel_DHG_700_C#) locomotive and tasked with creating a high-fidelity Figma design and a functional HTML/CSS prototype. 

My approach reimagined the technical, text-heavy data through an "Industrial Startup" aesthetic, focusing on a robust design system and high accessibility standards.


## Concept & Design
The goal of this school project was to transform a text-heavy Wikipedia entry into a modern, responsive web experience. Instead of a classic encyclopedic layout, I chose an "Industrial Startup" aesthetic to match the locomotive's character.

In about 8 hours I designed a OnePager in Figma, where I established a quick design system using components, text styles, and variables for fonts, gaps, colors, and typography, while ensuring high accessibility standards throughout the layout.

## Prototype Notes
The transition from Figma to code focused on maintaining visual fidelity while enhancing the user experience through meaningful motion.

**Interactive Foundations:** All interactive elements, particularly input fields and labels, feature distinct hover and focus states to ensure clear feedback and keyboard navigability.

- **Custom UI Motion:**
    - **Navigation:** The burger-menu is built with custom CSS animations for a seamless transition.
    - **Scroll Feedback:** A scroll-watcher provides a visual indicator of reading progress.
    - **Dynamic Hero:** The hero section features an isometric locomotive illustration that responds to cursor movement, creating a "snappy" and immersive depth effect.

- **Advanced Visuals:**
    - **Three.js Integration:** The image gallery utilizes a custom glitch hover effect powered by Three.js, leaning into the industrial-tech aesthetic.
    - **GSAP & SVG:** Complex SVG animations were handled via the GSAP library for high-performance vector motion.
    - **Micro-interactions:** Simple fade-in effects are triggered during scrolling to soften the content delivery and improve the "responsive" feel.

This project was a deep dive into the intersection of industrial aesthetics and modern web performance. Translating a technical, text-heavy Wikipedia entry into a functional, responsive prototype within a four-day window required a strict balance between high-fidelity design and efficient code execution.
