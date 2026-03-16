// assets/js/main.js
;(function () {
	const links = document.querySelectorAll('.nav__link')
	const path = location.pathname.split('/').pop() || 'index.php'

	links.forEach((a) => {
		const href = a.getAttribute('href')
		if (href === path) a.classList.add('is-active')
	})
})()
