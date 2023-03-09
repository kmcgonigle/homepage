// TODO add listener for "Enter" key that toggles the content open
// TODO add slideshow / additional thumbnails to each project
// TODO add explicit 'close' button

// Globals
const _expandedClassName = 'expanded';
const _openClassName = 'isOpen';

const projectList = document.getElementById('project-list');

// Ordering helper methods
const findElementInitialOrder = (name) => {
	return initialOrder.findIndex((id) => id === name);
};

const setInitialOrder = () => {
	// Project DOM elements will be prepended when active; capture the initial order so that we can reset
	// element position on close.
	const orderArr = [];
	for (const child of projectList.children) {
		orderArr.push(child.children[0].firstElementChild.getAttribute('href').replace('#', ''));
	}
	return orderArr;
};
const initialOrder = setInitialOrder();

// Open/Close methods
const closeProject = (targetHref, targetEl) => {
	const initialIndex = findElementInitialOrder(targetHref);
	const projectCount = projectList.children.length;

	// targetEl.classList.add('fadeOut');

	// setTimeout(() => {
		// Close item after fadeOut effect is complete
		if (initialIndex === (projectCount - 1)) {
			// If it's the last item, append to parent element
			projectList.appendChild(targetEl);
		} else {
			projectList.insertBefore(targetEl, projectList.children[initialIndex+1]);
		}

		targetEl.classList.remove(_openClassName);
		// targetEl.classList.remove('fadeOut');
	// }, 300);
};

const openProject = (targetEl) => {
	// Bring project to the top of the list and add the "isOpen" class
	projectList.prepend(targetEl);
	return targetEl.classList.add(_openClassName);
};

const expandProject = (event) => {
	// Any other link clicks should be ignored
	if (!event.target.closest('a').classList.contains('project-list__thumbnail')) return false;

	event.preventDefault();

	const targetHref = event.target.closest('a')?.getAttribute('href').replace('#', '');
	const targetEl = document.getElementById(targetHref).closest('li');

	if (!projectList.classList.contains(_expandedClassName)) {
		console.log('no items open');
		// No items are currently open; expand the clicked item
		openProject(targetEl);
		projectList.classList.add(_expandedClassName);
	} else {
		const isOpen = targetEl.classList.contains(_openClassName);

		if (!isOpen) {
			console.log('close current project and open new one');
			// Close the already-open project
			const currentProject = document.getElementsByClassName(_openClassName)[0];
			const currentProjectHref = currentProject.children[0].firstElementChild.getAttribute('href').replace('#', '');
			closeProject(currentProjectHref, currentProject);

			// Open the clicked project
			openProject(targetEl);
		} else {
			console.log('just close current project');
			// User is just collapsing the currently-open project
			closeProject(targetHref, targetEl);
			projectList.classList.remove(_expandedClassName);
		}
	}
};

projectList.addEventListener('click', expandProject, false);
