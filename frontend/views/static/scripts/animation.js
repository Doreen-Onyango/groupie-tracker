// animate sections in the about page
document.addEventListener("DOMContentLoaded", (event) => {
	const sections = document.querySelectorAll("section");

	const observerOptions = {
		root: null,
		rootMargin: "0px",
		threshold: 0.1,
	};

	const observer = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.style.animationPlayState = "running";
				observer.unobserve(entry.target);
			}
		});
	}, observerOptions);

	sections.forEach((section) => {
		section.style.animationPlayState = "paused";
		observer.observe(section);
	});

	const listItems = document.querySelectorAll("li");
	listItems.forEach((item) => {
		item.addEventListener("mouseenter", () => {
			item.style.transform = "translateX(5px)";
			item.style.color = "#3498db";
			item.style.transition = "all 0.3s ease";
		});
		item.addEventListener("mouseleave", () => {
			item.style.transform = "translateX(0)";
			item.style.color = "";
		});
	});

	const navItems = document.querySelectorAll(".navItem");
	navItems.forEach((item) => {
		item.addEventListener("mouseenter", () => {
			item.style.transform = "rotate(1deg)";
			item.style.color = "var(--code-color)";
			item.style.borderRadius = "30px";
			item.style.backgroundColor = "var(--pale-color)";
			item.style.transition = "all 0.5s ease";
		});
		item.addEventListener("mouseleave", () => {
			item.style.transform = "rotate(0deg)";
			item.style.color = "var(--text-color)";
			item.style.backgroundColor = "var(--shadow-color)";
		});
	});
});
