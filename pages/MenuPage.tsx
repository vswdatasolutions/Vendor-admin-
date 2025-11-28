import React, { useState } from 'react';
import Card from '../components/common/Card.tsx';
import Button from '../components/common/Button.tsx';
import Modal from '../components/common/Modal.tsx';
import LoadingSpinner from '../components/common/LoadingSpinner.tsx';
import { constants } from '../constants.ts';
import { Category, MenuItem, MenuItemType } from '../types.ts';

export const MenuPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: 'cat1', name: 'Appetizers', itemCount: 5, isAvailable: true },
    { id: 'cat2', name: 'Main Courses', itemCount: 10, isAvailable: true },
    { id: 'cat3', name: 'Desserts', itemCount: 3, isAvailable: false },
    { id: 'cat4', name: 'Beverages', itemCount: 7, isAvailable: true },
  ]);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: 'item1', name: 'Spring Rolls', description: 'Crispy vegetable rolls', price: 120, categoryId: 'cat1', categoryName: 'Appetizers', type: MenuItemType.VEG, imageUrl: 'https://via.placeholder.com/50', isAvailable: true },
    { id: 'item2', name: 'Chicken Tikka', description: 'Grilled chicken pieces', price: 250, categoryId: 'cat2', categoryName: 'Main Courses', type: MenuItemType.NON_VEG, imageUrl: 'https://via.placeholder.com/50', isAvailable: true },
    { id: 'item3', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center', price: 180, categoryId: 'cat3', categoryName: 'Desserts', type: MenuItemType.VEG, imageUrl: 'https://via.placeholder.com/50', isAvailable: false },
    { id: 'item4', name: 'Cold Coffee', description: 'Refreshing cold coffee', price: 90, categoryId: 'cat4', categoryName: 'Beverages', type: MenuItemType.VEG, imageUrl: 'https://via.placeholder.com/50', isAvailable: true },
  ]);

  const [activeTab, setActiveTab] = useState<'categories' | 'items'>('items'); // Default to items list

  // Category Management States
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');

  // Item Management States
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [itemStep, setItemStep] = useState(1); // For multi-step item creation
  const [newItemData, setNewItemData] = useState<Partial<MenuItem>>({ isAvailable: true, type: MenuItemType.VEG }); // For new item form
  const [editItemData, setEditItemData] = useState<Partial<MenuItem>>({}); // For edit item form
  const [itemImageFile, setItemImageFile] = useState<File | null>(null);
  const [itemImagePreview, setItemImagePreview] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Category Management Functions ---
  const handleOpenAddCategoryModal = () => {
    setNewCategoryName('');
    setError(null);
    setIsAddCategoryModalOpen(true);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!newCategoryName.trim()) {
      setError('Category name cannot be empty.');
      setLoading(false);
      return;
    }
    if (categories.some(cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      setError('Category with this name already exists.');
      setLoading(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    const newCat: Category = {
      id: `cat${categories.length + 1}`,
      name: newCategoryName.trim(),
      itemCount: 0,
      isAvailable: true,
    };
    setCategories(prev => [...prev, newCat]);
    setIsAddCategoryModalOpen(false);
    setLoading(false);
  };

  const handleOpenEditCategoryModal = (category: Category) => {
    setSelectedCategory(category);
    setEditCategoryName(category.name);
    setError(null);
    setIsEditCategoryModalOpen(true);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!editCategoryName.trim()) {
      setError('Category name cannot be empty.');
      setLoading(false);
      return;
    }
    if (categories.some(cat => cat.id !== selectedCategory?.id && cat.name.toLowerCase() === editCategoryName.trim().toLowerCase())) {
      setError('Category with this name already exists.');
      setLoading(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    setCategories(prev => prev.map(cat =>
      cat.id === selectedCategory?.id ? { ...cat, name: editCategoryName.trim() } : cat
    ));
    setIsEditCategoryModalOpen(false);
    setLoading(false);
  };

  const handleToggleCategoryStatus = async (categoryId: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setCategories(prev => prev.map(cat =>
      cat.id === categoryId ? { ...cat, isAvailable: !cat.isAvailable } : cat
    ));
    setLoading(false);
  };

  // --- Item Management Functions ---
  const handleOpenAddItemModal = () => {
    setNewItemData({ name: '', description: '', price: 0, categoryId: '', type: MenuItemType.VEG, isAvailable: true, imageUrl: '' });
    setItemStep(1);
    setItemImageFile(null);
    setItemImagePreview(null);
    setError(null);
    setIsAddItemModalOpen(true);
  };

  const handleAddItemDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewItemData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
  };

  const handleAddItemImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setItemImageFile(file);
      setItemImagePreview(URL.createObjectURL(file));
    } else {
      setItemImageFile(null);
      setItemImagePreview(null);
    }
  };

  const handleNextItemStep = () => {
    if (itemStep === 1) { // Validate Basic Details
      if (!newItemData.name || !newItemData.categoryId || !newItemData.price) {
        setError('Name, Category, and Price are required.');
        return;
      }
    }
    if (itemStep === 3) { // Validate Image
        if (!itemImageFile) {
            setError('Please upload an image for the item.');
            return;
        }
    }
    setError(null);
    setItemStep(prev => prev + 1);
  };

  const handlePrevItemStep = () => {
    setError(null);
    setItemStep(prev => prev - 1);
  };

  const handleFinalAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Final validation
    if (!newItemData.name || !newItemData.categoryId || !newItemData.price || !newItemData.type || !itemImageFile) {
        setError('Please complete all steps and provide an image.');
        setLoading(false);
        return;
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    const category = categories.find(cat => cat.id === newItemData.categoryId);
    if (!category) {
        setError('Selected category not found.');
        setLoading(false);
        return;
    }

    const newItem: MenuItem = {
      id: `item${menuItems.length + 1}`,
      name: newItemData.name,
      description: newItemData.description || '',
      price: newItemData.price,
      categoryId: newItemData.categoryId,
      categoryName: category.name,
      type: newItemData.type,
      imageUrl: itemImagePreview || 'https://via.placeholder.com/50', // Use preview URL or placeholder
      isAvailable: true,
    };
    setMenuItems(prev => [...prev, newItem]);
    setCategories(prev => prev.map(cat => cat.id === newItem.categoryId ? { ...cat, itemCount: cat.itemCount + 1 } : cat));
    setIsAddItemModalOpen(false);
    setLoading(false);
  };

  const handleOpenEditItemModal = (item: MenuItem) => {
    setSelectedItem(item);
    setEditItemData({ ...item });
    setItemImagePreview(item.imageUrl);
    setItemImageFile(null); // Clear file for new upload
    setError(null);
    setIsEditItemModalOpen(true);
  };

  const handleEditItemDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditItemData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
  };

  const handleEditItemImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setItemImageFile(file);
      setItemImagePreview(URL.createObjectURL(file));
    } else {
      setItemImageFile(null);
      setItemImagePreview(selectedItem?.imageUrl || null); // Revert to original if no new file
    }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!editItemData.name || !editItemData.categoryId || !editItemData.price || !editItemData.type) {
      setError('Name, Category, Price, and Food Type are required.');
      setLoading(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    const oldCategoryId = selectedItem?.categoryId;
    const newCategoryId = editItemData.categoryId;

    setMenuItems(prev => prev.map(item =>
      item.id === selectedItem?.id
        ? {
            ...item,
            ...editItemData,
            categoryName: categories.find(cat => cat.id === editItemData.categoryId)?.name || 'N/A',
            imageUrl: itemImagePreview || item.imageUrl,
          } as MenuItem
        : item
    ));

    // Update category item counts if category changed
    if (oldCategoryId && newCategoryId && oldCategoryId !== newCategoryId) {
        setCategories(prev => prev.map(cat => {
            if (cat.id === oldCategoryId) return { ...cat, itemCount: cat.itemCount - 1 };
            if (cat.id === newCategoryId) return { ...cat, itemCount: cat.itemCount + 1 };
            return cat;
        }));
    }

    setIsEditItemModalOpen(false);
    setLoading(false);
  };

  const handleToggleItemStatus = async (itemId: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setMenuItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
    ));
    setLoading(false);
  };

  const filteredItems = menuItems.filter(item =>
    selectedCategoryFilter ? item.categoryId === selectedCategoryFilter : true
  );

  // --- Statistics ---
  const totalItems = menuItems.length;
  const totalVeg = menuItems.filter(item => item.type === MenuItemType.VEG || item.type === MenuItemType.VEGAN).length;
  const totalNonVeg = menuItems.filter(item => item.type === MenuItemType.NON_VEG).length;
  const totalCategories = categories.length;


  return (
    <div className="space-y-6">
      <h1 className={`text-3xl font-bold text-${constants.colors.TEXT_DARK} mb-6`}>Menu Management</h1>

      {/* Statistics Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className={`flex flex-col items-center justify-center p-4 text-center bg-${constants.colors.BG_STAT_DARK}`}>
          <h3 className={`text-sm font-semibold text-${constants.colors.TEXT_LIGHT}`}>Total Items</h3>
          <p className={`text-3xl font-bold text-${constants.colors.TEXT_LIGHT} mt-1`}>{totalItems}</p>
        </Card>
        <Card className={`flex flex-col items-center justify-center p-4 text-center bg-${constants.colors.BG_STAT_DARK}`}>
          <h3 className={`text-sm font-semibold text-${constants.colors.TEXT_LIGHT}`}>Total Veg</h3>
          <p className={`text-3xl font-bold text-${constants.colors.TEXT_LIGHT} mt-1`}>{totalVeg}</p>
        </Card>
        <Card className={`flex flex-col items-center justify-center p-4 text-center bg-${constants.colors.BG_STAT_DARK}`}>
          <h3 className={`text-sm font-semibold text-${constants.colors.TEXT_LIGHT}`}>Total Non-Veg</h3>
          <p className={`text-3xl font-bold text-${constants.colors.TEXT_LIGHT} mt-1`}>{totalNonVeg}</p>
        </Card>
        <Card className={`flex flex-col items-center justify-center p-4 text-center bg-${constants.colors.BG_STAT_DARK}`}>
          <h3 className={`text-sm font-semibold text-${constants.colors.TEXT_LIGHT}`}>Total Categories</h3>
          <p className={`text-3xl font-bold text-${constants.colors.TEXT_LIGHT} mt-1`}>{totalCategories}</p>
        </Card>
      </div>

      {/* Tabs for Categories and Menu Items */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'items' ? 'border-b-2 border-offoOrange text-offoOrange' : `text-${constants.colors.TEXT_DARK} hover:text-offoOrange`}`}
          onClick={() => setActiveTab('items')}
        >
          Menu Items
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'categories' ? 'border-b-2 border-offoOrange text-offoOrange' : `text-${constants.colors.TEXT_DARK} hover:text-offoOrange`}`}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
      </div>

      {/* Menu Items Tab */}
      {activeTab === 'items' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className={`w-48 px-3 py-2 border border-gray-300 rounded-md bg-white text-${constants.colors.TEXT_DARK}`}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <Button variant="primary" onClick={handleOpenAddItemModal}>Add New Item</Button>
          </div>
          {filteredItems.length === 0 ? (
            <p className={`text-${constants.colors.ACCENT_GRAY} text-center py-4`}>No menu items found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map(item => (
                <Card key={item.id} className="p-4 relative">
                  <div className="absolute top-4 right-4">
                    <input
                      type="checkbox"
                      checked={item.isAvailable}
                      onChange={() => handleToggleItemStatus(item.id)}
                      className="h-4 w-4 text-offoOrange focus:ring-offoOrange border-gray-300 rounded"
                      title={item.isAvailable ? 'Disable Item' : 'Enable Item'}
                    />
                  </div>
                  <img src={item.imageUrl} alt={item.name} className="w-full h-32 object-cover rounded-md mb-3" />
                  <h3 className={`font-semibold text-lg text-${constants.colors.TEXT_DARK}`}>{item.name}</h3>
                  <p className={`text-sm text-${constants.colors.ACCENT_GRAY}`}>{item.description}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className={`font-bold text-offoOrange`}>₹{item.price.toFixed(2)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${item.type === MenuItemType.VEG ? 'bg-green-100 text-green-800' : item.type === MenuItemType.NON_VEG ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                      {item.type}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => handleOpenEditItemModal(item)}>Edit</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex justify-end mb-4">
            <Button variant="primary" onClick={handleOpenAddCategoryModal}>Add New Category</Button>
          </div>
          {categories.length === 0 ? (
            <p className={`text-${constants.colors.ACCENT_GRAY} text-center py-4`}>No categories defined.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(category => (
                <Card key={category.id} className="p-4 relative">
                  <div className="absolute top-4 right-4">
                    <input
                      type="checkbox"
                      checked={category.isAvailable}
                      onChange={() => handleToggleCategoryStatus(category.id)}
                      className="h-4 w-4 text-offoOrange focus:ring-offoOrange border-gray-300 rounded"
                      title={category.isAvailable ? 'Disable Category' : 'Enable Category'}
                    />
                  </div>
                  <h3 className={`font-semibold text-lg text-${constants.colors.TEXT_DARK}`}>{category.name}</h3>
                  <p className={`text-sm text-${constants.colors.ACCENT_GRAY}`}>{category.itemCount} items</p>
                  <span className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category.isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {category.isAvailable ? 'Active' : 'Disabled'}
                  </span>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => handleOpenEditCategoryModal(category)}>Edit</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        title="Add New Category"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsAddCategoryModalOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddCategory} disabled={loading}>
              {loading ? <LoadingSpinner /> : 'Add Category'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div>
            <label htmlFor="categoryName" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Category Name</label>
            <input
              type="text"
              id="categoryName"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </Modal>

      {/* Edit Category Modal */}
      {selectedCategory && (
        <Modal
          isOpen={isEditCategoryModalOpen}
          onClose={() => setIsEditCategoryModalOpen(false)}
          title={`Edit Category: ${selectedCategory.name}`}
          footer={
            <>
              <Button variant="ghost" onClick={() => setIsEditCategoryModalOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUpdateCategory} disabled={loading}>
                {loading ? <LoadingSpinner /> : 'Save Changes'}
              </Button>
            </>
          }
        >
          <form onSubmit={handleUpdateCategory} className="space-y-4">
            <div>
              <label htmlFor="editCategoryName" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Category Name</label>
              <input
                type="text"
                id="editCategoryName"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
        </Modal>
      )}

      {/* Add Item Modal (Multi-step) */}
      <Modal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        title={itemStep === 1 ? 'Add New Menu Item (1/4)' : itemStep === 2 ? 'Add New Menu Item (2/4)' : itemStep === 3 ? 'Add New Menu Item (3/4)' : 'Preview & Save (4/4)'}
        footer={
          <>
            <Button variant="ghost" onClick={itemStep === 1 ? () => setIsAddItemModalOpen(false) : handlePrevItemStep} disabled={loading}>
              {itemStep === 1 ? 'Cancel' : 'Back'}
            </Button>
            {itemStep < 4 ? (
              <Button variant="primary" onClick={handleNextItemStep} disabled={loading}>
                Next
              </Button>
            ) : (
              <Button variant="primary" onClick={handleFinalAddItem} disabled={loading}>
                {loading ? <LoadingSpinner /> : 'Save Item'}
              </Button>
            )}
          </>
        }
      >
        <form onSubmit={handleFinalAddItem} className="space-y-4">
          {itemStep === 1 && (
            <>
              <div>
                <label htmlFor="newItemName" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Name</label>
                <input
                  type="text"
                  id="newItemName"
                  name="name"
                  value={newItemData.name || ''}
                  onChange={handleAddItemDataChange}
                  className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
                  required
                />
              </div>
              <div>
                <label htmlFor="newItemCategory" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Category</label>
                <select
                  id="newItemCategory"
                  name="categoryId"
                  value={newItemData.categoryId || ''}
                  onChange={handleAddItemDataChange}
                  className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.filter(c => c.isAvailable).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="newItemPrice" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Price</label>
                <input
                  type="number"
                  id="newItemPrice"
                  name="price"
                  value={newItemData.price || ''}
                  onChange={handleAddItemDataChange}
                  className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
                  required
                />
              </div>
              <div>
                <label htmlFor="newItemDescription" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Description</label>
                <textarea
                  id="newItemDescription"
                  name="description"
                  value={newItemData.description || ''}
                  onChange={handleAddItemDataChange}
                  rows={3}
                  className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
                ></textarea>
              </div>
            </>
          )}
          {itemStep === 2 && (
            <div>
              <p className={`block text-sm font-medium text-${constants.colors.TEXT_DARK} mb-2`}>Food Type</p>
              <div className="flex flex-wrap gap-4">
                {Object.values(MenuItemType).map(type => (
                  <label key={type} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={newItemData.type === type}
                      onChange={handleAddItemDataChange}
                      className="form-radio h-4 w-4 text-offoOrange border-gray-300"
                    />
                    <span className={`ml-2 text-sm text-${constants.colors.TEXT_DARK}`}>{type}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          {itemStep === 3 && (
            <div>
              <label htmlFor="newItemImage" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Upload Image</label>
              <input
                type="file"
                id="newItemImage"
                name="imageUrl"
                accept="image/*"
                onChange={handleAddItemImageChange}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
              />
              {itemImagePreview && (
                <div className="mt-4">
                  <p className={`text-sm text-${constants.colors.TEXT_DARK} mb-2`}>Image Preview:</p>
                  <img src={itemImagePreview} alt="Item Preview" className="w-32 h-32 object-cover rounded-md" />
                </div>
              )}
            </div>
          )}
          {itemStep === 4 && (
            <div className="space-y-3">
              <h3 className={`font-semibold text-lg text-${constants.colors.TEXT_DARK}`}>Preview</h3>
              <div className="flex items-center space-x-4">
                <img src={itemImagePreview || 'https://via.placeholder.com/50'} alt="Item Preview" className="w-24 h-24 object-cover rounded-md" />
                <div>
                  <p className={`font-semibold text-${constants.colors.TEXT_DARK}`}>{newItemData.name}</p>
                  <p className={`text-sm text-${constants.colors.ACCENT_GRAY}`}>₹{newItemData.price?.toFixed(2)} - {newItemData.categoryName}</p>
                  <p className={`text-sm text-${constants.colors.ACCENT_GRAY}`}>{newItemData.description}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${newItemData.type === MenuItemType.VEG ? 'bg-green-100 text-green-800' : newItemData.type === MenuItemType.NON_VEG ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                    {newItemData.type}
                  </span>
                </div>
              </div>
              <div className="flex items-center mt-3">
                <input
                  type="checkbox"
                  id="newItemIsAvailable"
                  checked={newItemData.isAvailable}
                  onChange={(e) => setNewItemData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                  className="h-4 w-4 text-offoOrange focus:ring-offoOrange border-gray-300 rounded"
                />
                <label htmlFor="newItemIsAvailable" className={`ml-2 text-sm text-${constants.colors.TEXT_DARK}`}>Available</label>
              </div>
            </div>
          )}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </Modal>

      {/* Edit Item Modal */}
      {selectedItem && (
        <Modal
          isOpen={isEditItemModalOpen}
          onClose={() => setIsEditItemModalOpen(false)}
          title={`Edit Item: ${selectedItem.name}`}
          footer={
            <>
              <Button variant="ghost" onClick={() => setIsEditItemModalOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUpdateItem} disabled={loading}>
                {loading ? <LoadingSpinner /> : 'Save Changes'}
              </Button>
            </>
          }
        >
          <form onSubmit={handleUpdateItem} className="space-y-4">
            <div>
              <label htmlFor="editItemName" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Name</label>
              <input
                type="text"
                id="editItemName"
                name="name"
                value={editItemData.name || ''}
                onChange={handleEditItemDataChange}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
                required
              />
            </div>
            <div>
              <label htmlFor="editItemCategory" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Category</label>
              <select
                id="editItemCategory"
                name="categoryId"
                value={editItemData.categoryId || ''}
                onChange={handleEditItemDataChange}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
                required
              >
                <option value="">Select Category</option>
                {categories.filter(c => c.isAvailable).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="editItemPrice" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Price</label>
              <input
                type="number"
                id="editItemPrice"
                name="price"
                value={editItemData.price || ''}
                onChange={handleEditItemDataChange}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
                required
              />
            </div>
            <div>
              <label htmlFor="editItemDescription" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Description</label>
              <textarea
                id="editItemDescription"
                name="description"
                value={editItemData.description || ''}
                onChange={handleEditItemDataChange}
                rows={3}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
              ></textarea>
            </div>
            <div>
              <p className={`block text-sm font-medium text-${constants.colors.TEXT_DARK} mb-2`}>Food Type</p>
              <div className="flex flex-wrap gap-4">
                {Object.values(MenuItemType).map(type => (
                  <label key={type} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={editItemData.type === type}
                      onChange={handleEditItemDataChange}
                      className="form-radio h-4 w-4 text-offoOrange border-gray-300"
                    />
                    <span className={`ml-2 text-sm text-${constants.colors.TEXT_DARK}`}>{type}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="editItemImage" className={`block text-sm font-medium text-${constants.colors.TEXT_DARK}`}>Upload Image</label>
              <input
                type="file"
                id="editItemImage"
                name="imageUrl"
                accept="image/*"
                onChange={handleEditItemImageChange}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-offoOrange focus:border-offoOrange sm:text-sm bg-white text-${constants.colors.TEXT_DARK}`}
              />
              {itemImagePreview && (
                <div className="mt-4">
                  <p className={`text-sm text-${constants.colors.TEXT_DARK} mb-2`}>Current Image:</p>
                  <img src={itemImagePreview} alt="Item Preview" className="w-32 h-32 object-cover rounded-md" />
                </div>
              )}
            </div>
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="editItemIsAvailable"
                    checked={editItemData.isAvailable}
                    onChange={(e) => setEditItemData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                    className="h-4 w-4 text-offoOrange focus:ring-offoOrange border-gray-300 rounded"
                />
                <label htmlFor="editItemIsAvailable" className={`ml-2 text-sm text-${constants.colors.TEXT_DARK}`}>Available</label>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
        </Modal>
      )}
    </div>
  );
};