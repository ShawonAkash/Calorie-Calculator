//storage controller
const StorageCtrl = (function () {
  //public methods
  return {
    storeItem: function (item) {
      let items;
      //check if any items in
      if (localStorage.getItem('items') === null) {
        items = [];
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem('items'));

        items.push(item);
        //re set Local Storage
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemFromStorage: function () {
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updatedItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach(function (item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function (id) {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach(function (item, index) {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    cleatItemsFromStorage: function () {
      localStorage.removeItem('items');
    }
  }
})();


//Item Controller
const ItemCtrl = (function () {
  //Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }
  //Data Structure / State
  const data = {
    // items: [
    // {
    //   id: 0,
    //   name: 'Steak Dinner',
    //   calories: 1200
    // },
    // {
    //   id: 1,
    //   name: 'Cookie',
    //   calories: 400
    // },
    // {
    //   id: 2,
    //   name: 'Eggs',
    //   calories: 300
    // }
    // ],
    items: StorageCtrl.getItemFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  // Public methods
  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      let ID;
      //create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      //Calories to number
      calories = parseInt(calories);

      //Create new Item
      newItem = new Item(ID, name, calories);

      data.items.push(newItem);

      return newItem;
    },
    getItemById: function (id) {
      let found = null;
      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateListItem: function (name, calories) {
      //calories to number
      calories = parseInt(calories);
      let found = null;
      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function (id) {
      //get ID
      const ids = data.items.map(function (item) {
        return item.id;
      });
      //get index
      const index = ids.indexOf(id);
      //remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function () {
      data.items = [];
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    getTotalCalories: function () {
      let total = 0;

      data.items.forEach(function (item) {
        total += item.calories;

      });
      data.totalCalories = total;
      return data.totalCalories;
    },
    logData: function () {
      return data;
    }
  }
})();


//UI Controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }

  return {
    populateItemList: function (items) {
      let html = '';

      items.forEach(function (item) {
        html += `
        <li class="collection-item" id="item-${item.id}">
            <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-edit"></i>
            </a>
        </li>
        `;
      });

      //Insert List Items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: function (item) {
      //Show the List
      document.querySelector(UISelectors.itemList).style.display = 'block';
      //Create li Element
      const li = document.createElement('li');
      //add class 
      li.className = 'collection-item';
      li.id = `item-${item.id}`;
      //Add html
      li.innerHTML = `<strong>${item.name}:</strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-edit"></i>
      </a>`;
      //insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      //Turn node list into array
      listItems = Array.from(listItems);
      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute('id');
        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}:</strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-edit"></i>
          </a>`;
        }
      });
    },
    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function () {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      //turn node list into array
      listItems = Array.from(listItems);
      listItems.forEach(function (item) {
        item.remove();
      });
    },
    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    getSelectors: function () {
      return UISelectors;
    }
  }

})();



//App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
  //load Event Listeners
  const loadEventListeners = function () {
    //get UI selectors
    const UISelectors = UICtrl.getSelectors();

    //Add Item Event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    //Disable submit on enter
    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return true;
      }
    });

    //Edit icon Click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    //Update Item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    //Delete Button event 
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    //Back Button event 
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

    //clear Button event 
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
  }
  //Add Item Submit
  const itemAddSubmit = function (e) {
    //get Form input
    const input = UICtrl.getItemInput();
    //Check for name and calorie input
    if (input.name !== '' && input.calories !== '') {
      //Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      //Add Item to UI list
      UICtrl.addListItem(newItem);

      //Get the total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      //Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      //Store In LOcal Sto
      StorageCtrl.storeItem(newItem);

      //clear Fields
      UICtrl.clearInput();
    }
    e.preventDefault();
  }
  //Click edit item
  const itemEditClick = function (e) {
    if (e.target.classList.contains('edit-item')) {
      // GEt the lis item id(item-0 , item-1)
      const listId = e.target.parentNode.parentNode.id;
      //break into an array
      const listIdArr = listId.split('-');
      //get the actual id
      const id = parseInt(listIdArr[1]);
      //get item
      const itemToEdit = ItemCtrl.getItemById(id);
      //Set current item
      ItemCtrl.setCurrentItem(itemToEdit);
      //add item to form
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  }
  //Update item Submit
  const itemUpdateSubmit = function (e) {
    //get item input
    const input = UICtrl.getItemInput();
    //Update item
    const updatedItem = ItemCtrl.updateListItem(input.name, input.calories);
    //update UI
    UICtrl.updateListItem(updatedItem);
    //Get the total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    //Update local Storage
    StorageCtrl.updatedItemStorage(updatedItem);

    UICtrl.clearEditState();
    e.preventDefault();
  }
  //Delete item submit
  const itemDeleteSubmit = function (e) {
    //Get current Item
    const currentItem = ItemCtrl.getCurrentItem();
    //delete item form data structure
    ItemCtrl.deleteItem(currentItem.id);
    //Delete Form UI
    UICtrl.deleteListItem(currentItem.id);
    //Get the total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    //Delete from local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();
    e.preventDefault();
  }
  //Clear item event
  const clearAllItemsClick = function () {
    //delete all  items from data structure
    ItemCtrl.clearAllItems();

    //Get the total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    //remove form Ui
    UICtrl.removeItems();

    //clear form local sto
    StorageCtrl.cleatItemsFromStorage();

    //Hide UL
    UICtrl.hideList();
  }
  //Public Methods
  return {
    init: function () {
      //Clear edit state
      UICtrl.clearEditState();
      //Fetch Item Data Structure
      const items = ItemCtrl.getItems();

      //Check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        //Populate with Items
        UICtrl.populateItemList(items);
      }
      //Get the total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      //Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      //load event Listener
      loadEventListeners();
    }
  }

})(ItemCtrl, StorageCtrl, UICtrl);


//Initialize App
App.init();