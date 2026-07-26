"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const revealGroups = [
  ".section-heading",
  ".category-grid",
  ".product-grid",
  ".editorial-split",
  ".process-list",
  ".brewing-grid",
  ".review-grid",
  ".article-grid",
  ".profile-grid",
];

const revealItems = [
  ".section-heading > *",
  ".category-tile",
  ".product-card",
  ".editorial-image",
  ".editorial-copy > *",
  ".process-list li",
  ".brewing-card",
  ".review-card",
  ".article-card",
  ".profile-item",
  ".page-hero > *",
];

export function MotionExperience() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const cleanups: Array<() => void> = [];

    root.classList.toggle("motion-reduced", reducedMotion);

    const header = document.querySelector<HTMLElement>(".site-header");
    const updateHeader = () => {
      header?.classList.toggle("is-scrolled", window.scrollY > 18);
    };
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", updateHeader));

    const progress = document.querySelector<HTMLElement>(".scroll-progress");
    const updateProgress = () => {
      if (!progress) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio =
        max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      progress.style.transform = `scaleX(${ratio})`;
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    cleanups.push(() => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    });

    const groups = revealGroups.flatMap((selector) =>
      Array.from(document.querySelectorAll<HTMLElement>(selector)),
    );
    const items = revealItems.flatMap((selector) =>
      Array.from(document.querySelectorAll<HTMLElement>(selector)),
    );
    const uniqueItems = Array.from(new Set(items));

    groups.forEach((group) => group.setAttribute("data-motion-group", ""));
    uniqueItems.forEach((item) => {
      const siblings = item.parentElement
        ? Array.from(item.parentElement.children).filter((element) =>
            uniqueItems.includes(element as HTMLElement),
          )
        : [];
      const order = Math.max(0, siblings.indexOf(item));
      item.setAttribute("data-motion-item", "");
      item.style.setProperty("--motion-order", String(Math.min(order, 7)));
    });

    if (reducedMotion) {
      uniqueItems.forEach((item) =>
        item.setAttribute("data-motion-visible", ""),
      );
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.setAttribute("data-motion-visible", "");
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
      );
      uniqueItems.forEach((item) => observer.observe(item));
      groups.forEach((group) => observer.observe(group));
      cleanups.push(() => observer.disconnect());
    }

    const revealFrame = requestAnimationFrame(() => {
      root.classList.add("motion-system-ready");
    });
    cleanups.push(() => cancelAnimationFrame(revealFrame));

    if (!reducedMotion) {
      const hero = document.querySelector<HTMLElement>(".hero");
      const heroImage = hero?.querySelector<HTMLElement>(".hero-image");
      const heroCopy = hero?.querySelector<HTMLElement>(".hero-copy");

      if (hero && heroImage && heroCopy) {
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;
        let scrollProgress = 0;
        let frame = 0;

        const render = () => {
          currentX += (targetX - currentX) * 0.085;
          currentY += (targetY - currentY) * 0.085;
          const imageY = scrollProgress * 48 + currentY * 8;
          heroImage.style.transform = `translate3d(${currentX * 10}px, ${imageY}px, 0) scale(1.075)`;
          heroCopy.style.transform = `translate3d(0, ${scrollProgress * -18}px, 0)`;
          heroCopy.style.opacity = String(
            Math.max(0.34, 1 - scrollProgress * 0.58),
          );

          if (
            Math.abs(targetX - currentX) > 0.002 ||
            Math.abs(targetY - currentY) > 0.002
          ) {
            frame = requestAnimationFrame(render);
          } else {
            frame = 0;
          }
        };

        const schedule = () => {
          if (!frame) frame = requestAnimationFrame(render);
        };
        const onPointerMove = (event: PointerEvent) => {
          const bounds = hero.getBoundingClientRect();
          targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
          targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
          hero.style.setProperty(
            "--hero-glow-x",
            `${event.clientX - bounds.left}px`,
          );
          hero.style.setProperty(
            "--hero-glow-y",
            `${event.clientY - bounds.top}px`,
          );
          schedule();
        };
        const onPointerLeave = () => {
          targetX = 0;
          targetY = 0;
          schedule();
        };
        const onHeroScroll = () => {
          const bounds = hero.getBoundingClientRect();
          scrollProgress = Math.min(
            1,
            Math.max(0, -bounds.top / Math.max(1, bounds.height)),
          );
          schedule();
        };

        hero.addEventListener("pointermove", onPointerMove);
        hero.addEventListener("pointerleave", onPointerLeave);
        window.addEventListener("scroll", onHeroScroll, { passive: true });
        cleanups.push(() => {
          hero.removeEventListener("pointermove", onPointerMove);
          hero.removeEventListener("pointerleave", onPointerLeave);
          window.removeEventListener("scroll", onHeroScroll);
          cancelAnimationFrame(frame);
          heroImage.style.removeProperty("transform");
          heroCopy.style.removeProperty("transform");
          heroCopy.style.removeProperty("opacity");
        });
      }

      const finePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)",
      ).matches;
      if (finePointer) {
        document
          .querySelectorAll<HTMLElement>(".product-media")
          .forEach((media) => {
            let frame = 0;
            let rotateX = 0;
            let rotateY = 0;

            const paint = () => {
              media.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
              frame = 0;
            };
            const onMove = (event: PointerEvent) => {
              const bounds = media.getBoundingClientRect();
              const x = (event.clientX - bounds.left) / bounds.width;
              const y = (event.clientY - bounds.top) / bounds.height;
              rotateX = (0.5 - y) * 7;
              rotateY = (x - 0.5) * 8;
              media.style.setProperty("--glare-x", `${x * 100}%`);
              media.style.setProperty("--glare-y", `${y * 100}%`);
              if (!frame) frame = requestAnimationFrame(paint);
            };
            const onLeave = () => {
              rotateX = 0;
              rotateY = 0;
              media.style.removeProperty("--glare-x");
              media.style.removeProperty("--glare-y");
              media.style.transform = "";
            };
            media.addEventListener("pointermove", onMove);
            media.addEventListener("pointerleave", onLeave);
            cleanups.push(() => {
              media.removeEventListener("pointermove", onMove);
              media.removeEventListener("pointerleave", onLeave);
              cancelAnimationFrame(frame);
            });
          });
      }
    }

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      root.classList.remove("motion-system-ready");
      groups.forEach((group) => group.removeAttribute("data-motion-group"));
      uniqueItems.forEach((item) => {
        item.removeAttribute("data-motion-item");
        item.removeAttribute("data-motion-visible");
        item.style.removeProperty("--motion-order");
      });
    };
  }, [pathname]);

  return (
    <div className="motion-chrome" aria-hidden="true">
      <span className="scroll-progress" />
    </div>
  );
}
