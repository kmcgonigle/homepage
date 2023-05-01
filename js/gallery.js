// TODO add listener for "Enter" key that toggles the content open, as well as for explicit close button
// TODO add slideshow / additional thumbnails to each project

// Globals
const _expandedClassName = 'expanded';
const _openClassName = 'isOpen';

const parentSection = document.getElementById('projects');
const projectList = document.getElementById('project-list');
const closeBtn = document.getElementById('closeProject');

// Loading the gallery items
const projectTemplate = (data) => {
	return (
		`<li>
			<div>
				<a href="#${data.id}" class="project-list__thumbnail">
					<img src="images/${data.primaryPhotoFilename}" alt="${data.primaryPhotoAlt}" />
					<p>${data.linkText}</p>
				</a>
			</div>

			<div id="${data.id}" class="project-list__description">
				<div>
					<h3>${data.header}</h3>
					${data.content}
				</div>
			</div>
		</li>`
	);
}
const loadProjects = (() => {
	if (!galleryData || !galleryData?.projects?.length === 0) return;

	galleryData.projects.forEach(project => {
		// Add each project as a <li> within the projectList <ul>
		projectList.innerHTML += projectTemplate(project);
	});
})(); // IIFE

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

	const targetHref = event.target.closest('a')?.getAttribute('href').replace('#', '');
	const targetEl = document.getElementById(targetHref).closest('li');

	if (!parentSection.classList.contains(_expandedClassName)) {
		// No items are currently open; expand the clicked item
		openProject(targetEl);
		parentSection.classList.add(_expandedClassName);
	} else {
		const isOpen = targetEl.classList.contains(_openClassName);

		if (!isOpen) {
			// Close the already-open project
			const currentProject = document.getElementsByClassName(_openClassName)[0];
			const currentProjectHref = currentProject.children[0].firstElementChild.getAttribute('href').replace('#', '');
			closeProject(currentProjectHref, currentProject);

			// Open the clicked project
			openProject(targetEl);
		} else {
			// User is just collapsing the currently-open project
			closeProject(targetHref, targetEl);
			parentSection.classList.remove(_expandedClassName);
		}
	}
};

// Explicit 'close' button
const handleCloseBtn = (event) => {
	const openSection = document.getElementsByClassName(_openClassName)[0];
	const openSectionName = openSection.children[0].firstElementChild.getAttribute('href').replace('#', '');
	const targetEl = document.getElementById(openSectionName).closest('li');

	closeProject(openSectionName, targetEl);
	return parentSection.classList.remove(_expandedClassName);
};

// Add event listeners
projectList.addEventListener('click', expandProject, false);
closeBtn.addEventListener('click', handleCloseBtn, false);

// If project-name hash is in address bar, automatically open corresponding project description
const projectNameHash = window.location.hash;
if (projectNameHash && projectNameHash !== '#projects') {
	const nameWithoutHash = projectNameHash.replace('#', '');
	const targetSection = document.getElementById(nameWithoutHash).closest('li');

	openProject(targetSection);
	parentSection.classList.add(_expandedClassName);
}
