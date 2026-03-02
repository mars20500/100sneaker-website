import { useEffect } from "react";

/**
 * Observes all elements with the `.reveal` or `.reveal-stagger` class
 * and adds `.visible` when they scroll into the viewport.
 */
export function useReveal() {
    useEffect(() => {
        const targets = document.querySelectorAll(".reveal, .reveal-stagger");
        if (!targets.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        targets.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);
}
