(function() {

	// Add events on body
	var bodyEl = document.getElementsByTagName('body')[0];
	bodyEl.addEventListener("click", handleClick);
	bodyEl.addEventListener("keyup", handleKeyup);
	bodyEl.addEventListener("keydown", handleKeydown);

	// (string) store input value
	var inputVal = '';
	// (array) initialize data
	var data = TABLE_DATA;
	// (array) store selected items id in data
	var selectedItems = [];
	// store maximum items, which used to detect whether to re-render
	var maxItems = TABLE_DATA.length + 1; 
	// store data to be visible (after filtering with keyword)
	var availableData = data;
	// store index of item in availableData array, then map the tem in availableData with data
	var currentActive = -1;               

	// DOM elements
	var inputEl = document.getElementById("apps_input");
	var listWrapperEl = document.getElementById("suggest__inner");
	var listEl = document.getElementById("suggest__list");

	render();

	// render suggest__list DOM element
	function render() {
		data = TABLE_DATA.filter(x => selectedItems.indexOf(x.id) < 0);
		if (data.length < maxItems) {
			maxItems = data.length;
			availableData = data;
			listEl.innerHTML = '';
			for (item of data) {
				var itemEl = document.createElement("li");
				itemEl.classList.add("suggest__item");
				itemEl.dataset.itemId = item.id;

				var imgEl = document.createElement("img");
				imgEl.src = item.thumbnailUrl;

				var itemImgEl = document.createElement("p");
				itemImgEl.classList.add("suggest__item__img");
				itemImgEl.appendChild(imgEl);

				var itemTtlEl = document.createElement("h4");
				itemTtlEl.classList.add("suggest__item__ttl");
				itemTtlEl.innerHTML = encodeURI(item.name);

				itemEl.appendChild(itemImgEl);
				itemEl.appendChild(itemTtlEl);


				listEl.appendChild(itemEl);
			}
		}
	}

	// Handle click on DOM
	function handleClick(e) {
		// Click (focus) into input
		// Result: Display suggest layer, focus into input with cursor to the end of the displayed text
		if (e.target.id === 'apps_input') {
			showSuggest();
			inputEl.setSelectionRange(inputVal.length, inputVal.length);
		}
		// Click outside input
		// Result: Hide suggest layer, and if target is an item, update input value
		else {
			if (!!e.target.closest("li")) {
				let itemId = e.target.closest("li").dataset.itemId;
				chooseData(itemId);
			}
			hideSuggest();
		}
	}

	// Handle Enter key
	// Result: Hide suggest layer, update input value
	function handleKeydown(e) {
		var itemElArr = document.getElementsByClassName("suggest__item");
		var itemActiveClass = 'suggest__item--active';
		
		switch(e.key) {
			case "Enter":
				e.preventDefault();
				if (listEl.classList.contains("suggest__list--show")) {
					var domId = data.indexOf(availableData[currentActive]);
					let itemId = itemElArr[domId].dataset.itemId;
					chooseData(itemId);
					resetActiveItemClass(itemElArr, itemActiveClass);
					hideSuggest();
				}
				break;
		}
	}

	// Handle keys (except Enter)
	function handleKeyup(e) {

		var itemElArr = document.getElementsByClassName("suggest__item");
		var itemActiveClass = 'suggest__item--active';

		switch(e.key) {
			case "ArrowDown":
				if (listEl.classList.contains("suggest__list--show")) {
					if (++currentActive >= availableData.length) currentActive = 0;
					setActiveItemClass(itemElArr, itemActiveClass);
				}
				break;
			case "ArrowUp":
				if (listEl.classList.contains("suggest__list--show")) {
					if (--currentActive < 0) currentActive = availableData.length - 1;
					setActiveItemClass(itemElArr, itemActiveClass);
				}
				break;
			default: 
				let keyword = inputEl.value.replace(inputVal, '');
				var searchResultData = data.filter(x => x.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1);
				let searchResult = searchResultData.map(x => x.id);
				availableData = searchResultData;
				currentActive = -1;

				[].forEach.call(itemElArr, function(item) {
					if (searchResult.indexOf(item.dataset.itemId) < 0) {
						item.style.display = 'none';
					} else {
						item.style.display = 'flex';
					}
				});
				break;
		}
	}

	// Display suggest layer
	function showSuggest() {
		listEl.classList.add("suggest__list--show");
		render();
	}

	// Hide suggest layer
	function hideSuggest() {
		listEl.classList.remove("suggest__list--show");
	}

	// Update input value, update selectedItems
	function chooseData(itemId) {
		var result = TABLE_DATA.find(x => x.id === itemId);
		if (selectedItems.indexOf(result.id) < 0) {
			selectedItems.push(result.id);
		}
		inputVal += result.name + ', ';
		inputEl.value = inputVal;
		inputEl.blur();
		maxItems = TABLE_DATA.length + 1;
	}

	function resetActiveItemClass(itemElArr, className) {
		[].forEach.call(itemElArr, function(item) {
			item.classList.remove(className);
		});
	}

	function setActiveItemClass(itemElArr, className) {
		resetActiveItemClass(itemElArr, className);
		var domId = data.indexOf(availableData[currentActive]);
		itemElArr[domId].classList.add(className);
		itemElArr[domId].scrollIntoView();
	}

})();