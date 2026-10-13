import React, { useState } from 'react';
import {
  Compass,
  Plus,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Clock,
  MapPin,
  Tag,
  CheckCircle2,
  Trash2,
  Edit3,
  Store,
  DollarSign,
  AlertCircle,
  X,
  Layers,
  Sparkles,
  FolderPlus,
  FolderOpen,
  LayoutGrid,
  List,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TourPackage } from '../../types';

export const ServicesManagementView: React.FC = () => {
  const {
    packages,
    packageCategories,
    addPackage,
    updatePackage,
    deletePackage,
    addPackageCategory,
    deletePackageCategory,
    currentRole,
    roleConfig,
    language,
    convertAmount,
    setActiveTab,
  } = useApp();

  const isSuperAdmin = currentRole === 'super-admin';

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [layoutMode, setLayoutMode] = useState<'card' | 'list'>('card');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [categoryModalError, setCategoryModalError] = useState<string | null>(null);
  const [categoryModalSuccess, setCategoryModalSuccess] = useState<string | null>(null);

  // Inline Category Add inside Add Package Modal
  const [showInlineAddCategory, setShowInlineAddCategory] = useState<boolean>(false);
  const [inlineCategoryInput, setInlineCategoryInput] = useState<string>('');

  const [editingPkgId, setEditingPkgId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [category, setCategory] = useState<string>('Desert Safari');
  const [duration, setDuration] = useState('4 Hours');
  const [priceQAR, setPriceQAR] = useState<number>(450);
  const [pickupLocation, setPickupLocation] = useState('Hamad Int’l Airport (HIA) Arrivals Bay 4');
  const [inclusionsInput, setInclusionsInput] = useState('4x4 Land Cruiser, Licensed Safari Guide, Refreshments');
  const [description, setDescription] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');

  const allCategories = ['All', ...packageCategories];

  const filteredPackages =
    activeCategory === 'All'
      ? packages
      : packages.filter((p) => p.category === activeCategory);

  const handleOpenAddModal = () => {
    if (!isSuperAdmin) {
      setErrorMessage(
        language === 'ar'
          ? 'عذراً: فقط المدير العام (Super Admin) يملك صلاحية إضافة وتعديل باقات الخدمات.'
          : 'Access Denied: Only Super Admin (Sheikh Nasser Al-Thani) has permission to add or modify tour services.'
      );
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }
    setEditingPkgId(null);
    setName('');
    setNameAr('');
    setCategory('Desert Safari');
    setDuration('4 Hours');
    setPriceQAR(450);
    setPickupLocation('Hamad Int’l Airport (HIA) Arrivals Bay 4');
    setInclusionsInput('4x4 Land Cruiser, Licensed Tour Guide, Mineral Water & Karak');
    setDescription('Exclusive guided tour tailored for Qatar travelers and transit guests.');
    setDescriptionAr('جولة سياحية بإشراف مرشدين معتمدين خصيصاً لمسافري الدوحة وترانزيت مطار حمد.');
    setShowAddModal(true);
  };

  const handleOpenEditModal = (pkg: TourPackage) => {
    if (!isSuperAdmin) {
      setErrorMessage(
        language === 'ar'
          ? 'عذراً: تعديل الخدمات محصور بالمدير العام فقط.'
          : 'Access Denied: Modifying services is restricted to Super Admin.'
      );
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }
    setEditingPkgId(pkg.id);
    setName(pkg.name);
    setNameAr(pkg.nameAr);
    setCategory(pkg.category);
    setDuration(pkg.duration);
    setPriceQAR(pkg.priceQAR);
    setPickupLocation(pkg.pickupLocation);
    setInclusionsInput(pkg.includes.join(', '));
    setDescription(pkg.description);
    setDescriptionAr(pkg.descriptionAr);
    setShowAddModal(true);
  };

  const handleDelete = (id: string, pkgName: string) => {
    if (!isSuperAdmin) {
      setErrorMessage('Access Denied: Only Super Admin can delete services.');
      setTimeout(() => setErrorMessage(null), 3500);
      return;
    }
    if (window.confirm(`Are you sure you want to remove "${pkgName}" from the tour catalog?`)) {
      const res = deletePackage(id);
      if (res.success) {
        setSuccessMessage(`Package "${pkgName}" successfully deleted.`);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setErrorMessage(res.error || 'Failed to delete package.');
        setTimeout(() => setErrorMessage(null), 3500);
      }
    }
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const res = addPackageCategory(newCategoryName);
    if (res.success) {
      setCategoryModalSuccess(`Category "${newCategoryName.trim()}" created successfully!`);
      setNewCategoryName('');
      setTimeout(() => setCategoryModalSuccess(null), 3000);
    } else {
      setCategoryModalError(res.error || 'Failed to add category.');
      setTimeout(() => setCategoryModalError(null), 3500);
    }
  };

  const handleDeleteCategory = (catName: string) => {
    if (!isSuperAdmin) {
      setCategoryModalError('Access Denied: Only Super Admin can delete tour categories.');
      setTimeout(() => setCategoryModalError(null), 3500);
      return;
    }
    const res = deletePackageCategory(catName);
    if (res.success) {
      setCategoryModalSuccess(`Category "${catName}" removed.`);
      if (activeCategory === catName) setActiveCategory('All');
      setTimeout(() => setCategoryModalSuccess(null), 3000);
    } else {
      setCategoryModalError(res.error || 'Failed to remove category.');
      setTimeout(() => setCategoryModalError(null), 3500);
    }
  };

  const handleInlineAddCategory = () => {
    if (!inlineCategoryInput.trim()) return;
    const res = addPackageCategory(inlineCategoryInput);
    if (res.success) {
      setCategory(inlineCategoryInput.trim());
      setInlineCategoryInput('');
      setShowInlineAddCategory(false);
      setSuccessMessage(`Category "${inlineCategoryInput.trim()}" created and selected!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setErrorMessage(res.error || 'Failed to create category.');
      setTimeout(() => setErrorMessage(null), 3500);
    }
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const includesArray = inclusionsInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (editingPkgId) {
      // Update existing
      const res = updatePackage(editingPkgId, {
        name,
        nameAr: nameAr || name,
        category,
        duration,
        priceQAR: Number(priceQAR),
        pickupLocation,
        includes: includesArray,
        description,
        descriptionAr: descriptionAr || description,
      });

      if (res.success) {
        setSuccessMessage(`Service "${name}" updated successfully.`);
        setShowAddModal(false);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setErrorMessage(res.error || 'Update failed.');
      }
    } else {
      // Add new
      const res = addPackage({
        name,
        nameAr: nameAr || name,
        category,
        duration,
        priceQAR: Number(priceQAR),
        pickupLocation,
        includes: includesArray,
        description,
        descriptionAr: descriptionAr || description,
      });

      if (res.success) {
        setSuccessMessage(`New tour service "${name}" created and synced with POS!`);
        setShowAddModal(false);
        setTimeout(() => setSuccessMessage(null), 3500);
      } else {
        setErrorMessage(res.error || 'Creation failed.');
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Module Header & Permissions Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{language === 'ar' ? 'إدارة باقات وخدمات الرحلات' : 'Tour Packages & Services Catalog'}</span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {packages.length} Active
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'ar'
                  ? 'باقات سياحية معتمدة من قطر للسياحة، مع تحويل العملات وتعيين مواقع الالتقاء بمطار حمد'
                  : 'Qatar Tourism accredited packages, live multi-currency pricing & HIA arrivals dispatch slots'}
              </p>
            </div>
          </div>
        </div>

        {/* Super Admin Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isSuperAdmin
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 active:scale-98 cursor-pointer'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700'
            }`}
            title={
              isSuperAdmin
                ? 'Add a new tour package / service'
                : 'Restricted: Only Super Admin can add new tour services'
            }
          >
            {isSuperAdmin ? (
              <>
                <Plus className="w-4 h-4" />
                <span>{language === 'ar' ? '+ إضافة خدمة / باقة جديدة' : '+ Add New Tour Service'}</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-amber-500" />
                <span>{language === 'ar' ? 'إضافة خدمة (صلاحية Super Admin)' : '+ Add Service (Super Admin Only)'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Role Security Scope Notification */}
      {isSuperAdmin ? (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-300">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold">Super Admin Privilege Verified: </span>
              <span>
                You are logged in as <strong className="font-semibold">{roleConfig.userDisplayName}</strong>. You have exclusive authority to create new services, configure pricing rules, and delete catalog items.
              </span>
            </div>
          </div>
          <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold shrink-0">
            SERVICE CREATOR AUTHORIZED
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-300">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <span className="font-bold">Catalog Read-Only Mode: </span>
              <span>
                Service creation and price adjustments are restricted strictly to <strong>Super Admin</strong>. Your current role is <strong>{roleConfig.title}</strong> ({roleConfig.userDisplayName}).
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-bold shrink-0">
            RESTRICTED
          </span>
        </div>
      )}

      {/* Toasts / Flash Alerts */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 3. Category Filter Tabs & Management */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-2 shrink-0">
          {allCategories.map((cat) => {
            const count =
              cat === 'All'
                ? packages.length
                : packages.filter((p) => p.category === cat).length;
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-blue-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Manage / Add Categories Button & Layout Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800 cursor-pointer"
            title={language === 'ar' ? 'إضافة وإدارة تصنيفات الرحلات' : 'Manage & Add Tour Package Categories'}
          >
            <FolderPlus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{language === 'ar' ? '+ إدارة وإضافة التصنيفات' : '+ Categories'}</span>
          </button>

          {/* Card / List Layout Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
            <button
              type="button"
              onClick={() => setLayoutMode('card')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                layoutMode === 'card'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px]">Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode('list')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                layoutMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="List Table View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px]">List</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Packages Grid or List Table */}
      {layoutMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPackages.map((pkg) => {
          const usdPrice = convertAmount(pkg.priceQAR, 'USD');
          const eurPrice = convertAmount(pkg.priceQAR, 'EUR');

          return (
            <div
              key={pkg.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header & Badges */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                    {pkg.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{pkg.duration}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {pkg.name}
                </h3>
                {pkg.nameAr && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5 font-medium">
                    {pkg.nameAr}
                  </p>
                )}

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {pkg.description}
                </p>

                {/* Location */}
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">{pkg.pickupLocation}</span>
                </div>

                {/* Inclusions Tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {pkg.includes.map((inc, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      ✓ {inc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom: Pricing & Actions */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-slate-400 font-mono">QAR</span>
                    <span className="text-lg font-black text-slate-900 dark:text-white tabular-nums">
                      {pkg.priceQAR.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono tabular-nums">
                    ≈ {usdPrice.formatted} | {eurPrice.formatted}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveTab('pos')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/60 dark:hover:text-blue-400 transition-colors cursor-pointer"
                    title="Book in Agent Desk POS"
                  >
                    <Store className="w-4 h-4" />
                  </button>

                  {isSuperAdmin ? (
                    <>
                      <button
                        onClick={() => handleOpenEditModal(pkg)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/60 dark:hover:text-blue-400 transition-colors cursor-pointer"
                        title="Edit Service"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id, pkg.name)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/60 dark:hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <span
                      className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-400 flex items-center gap-1"
                      title="Modification locked to Super Admin"
                    >
                      <Lock className="w-3 h-3 text-amber-500" />
                      <span>Admin Only</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      ) : (
        /* Packages List / Table View ("list view te dekha jay ei option ta add koro") */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  <th className="py-3.5 px-4">Service & Arabic Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Duration & Pickup</th>
                  <th className="py-3.5 px-4 text-right">Price (QAR)</th>
                  <th className="py-3.5 px-4 text-right">FX (USD / EUR)</th>
                  <th className="py-3.5 px-4">Included Highlights</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredPackages.map((pkg) => {
                  const usdPrice = convertAmount(pkg.priceQAR, 'USD');
                  const eurPrice = convertAmount(pkg.priceQAR, 'EUR');

                  return (
                    <tr
                      key={pkg.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900 dark:text-white">
                          {pkg.name}
                        </div>
                        {pkg.nameAr && (
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                            {pkg.nameAr}
                          </div>
                        )}
                        <p className="text-[11px] text-slate-400 line-clamp-1 max-w-sm mt-0.5">
                          {pkg.description}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                          {pkg.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{pkg.duration}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{pkg.pickupLocation}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                        {pkg.priceQAR.toLocaleString()} QAR
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        <div>${usdPrice.amount.toFixed(0)} USD</div>
                        <div className="text-[10px]">€{eurPrice.amount.toFixed(0)} EUR</div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {pkg.includes.slice(0, 2).map((inc, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 truncate max-w-[130px]"
                            >
                              {inc}
                            </span>
                          ))}
                          {pkg.includes.length > 2 && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              +{pkg.includes.length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setActiveTab('pos');
                            }}
                            className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer shadow-xs"
                            title="Direct Book at POS"
                          >
                            <Store className="w-3 h-3" />
                            <span>POS</span>
                          </button>

                          {isSuperAdmin ? (
                            <>
                              <button
                                onClick={() => handleOpenEditModal(pkg)}
                                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/60 dark:hover:text-blue-400 transition cursor-pointer"
                                title="Edit Service"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDelete(pkg.id, pkg.name)}
                                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/60 dark:hover:text-rose-400 transition cursor-pointer"
                                title="Delete Service"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <span
                              className="px-1.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-400 flex items-center gap-0.5"
                              title="Modification locked to Super Admin"
                            >
                              <Lock className="w-3 h-3 text-amber-500" />
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Add / Edit Package Modal (Super Admin Only) */}
      {showAddModal && isSuperAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {editingPkgId
                      ? (language === 'ar' ? 'تعديل باقة سياحية' : 'Edit Tour Service Package')
                      : (language === 'ar' ? 'إنشاء باقة سياحية جديدة' : 'Create New Tour Service (Super Admin)')}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Will instantly sync with Agent Desk POS and Unified Bookings Engine
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSavePackage} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Service Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Al Zubarah Fort & North Qatar Safari"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Service Name (Arabic)
                  </label>
                  <input
                    type="text"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="مثال: جولة قلعة الزبارة وشمال قطر التراثية"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-700 dark:text-slate-300 font-bold">
                      Category *
                    </label>
                    {isSuperAdmin && (
                      <button
                        type="button"
                        onClick={() => setShowInlineAddCategory((prev) => !prev)}
                        className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{showInlineAddCategory ? 'Cancel' : '+ New'}</span>
                      </button>
                    )}
                  </div>

                  {showInlineAddCategory && (
                    <div className="mb-2 p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 space-y-1.5 animate-in fade-in">
                      <span className="text-[10px] font-bold text-blue-800 dark:text-blue-300">Quick Add Category</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={inlineCategoryInput}
                          onChange={(e) => setInlineCategoryInput(e.target.value)}
                          placeholder="e.g. Dhow Marina Cruise"
                          className="flex-1 bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-700 rounded-lg px-2 py-1 text-xs text-slate-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={handleInlineAddCategory}
                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shrink-0 cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-medium"
                  >
                    {packageCategories.map((catName) => (
                      <option key={catName} value={catName}>
                        {catName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Duration *
                  </label>
                  <input
                    type="text"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 4.5 Hours"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Price in QAR *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={50}
                      step={10}
                      value={priceQAR}
                      onChange={(e) => setPriceQAR(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-bold font-mono"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-[11px]">
                      QAR
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Default Pickup Bay / Airport Location *
                </label>
                <input
                  type="text"
                  required
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="e.g. HIA Arrivals Counter 4 / Pickup Bay 2"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Included Amenities & Perks (comma separated)
                </label>
                <input
                  type="text"
                  value={inclusionsInput}
                  onChange={(e) => setInclusionsInput(e.target.value)}
                  placeholder="e.g. 4x4 Land Cruiser, Licensed Guide, Camel Ride, Bedouin Refreshments"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Detailed Description (English)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide an enticing itinerary overview for transit desk agents and passengers..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md shadow-blue-500/20 active:scale-98"
                >
                  {editingPkgId ? 'Save Changes' : 'Publish Tour Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Manage & Add Categories Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {language === 'ar' ? 'إدارة وتصنيف باقات الرحلات' : 'Manage Tour Package Categories'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'ar'
                      ? 'إضافة فئات وتصنيفات مخصصة للرحلات والربط مع نظام نقاط البيع'
                      : 'Configure customizable tour categories for catalog filtering and agent desk POS'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  setCategoryModalError(null);
                  setCategoryModalSuccess(null);
                }}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Role privilege notice */}
            {isSuperAdmin ? (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Super Admin authorized: You can add new tour categories and delete unused ones.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Only Super Admin has permissions to create or delete tour categories.</span>
              </div>
            )}

            {/* In-modal alerts */}
            {categoryModalError && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{categoryModalError}</span>
              </div>
            )}
            {categoryModalSuccess && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{categoryModalSuccess}</span>
              </div>
            )}

            {/* Add Category Form (Only Super Admin can submit) */}
            {isSuperAdmin && (
              <form onSubmit={handleCreateCategory} className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {language === 'ar' ? 'اسم التصنيف الجديد' : 'New Category Name'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Dhow Marina Cruise, Extreme Dune Bashing, Museum & Art..."
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500/30"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{language === 'ar' ? 'إضافة' : 'Add Category'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Existing Categories List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Active Tour Categories ({packageCategories.length})</span>
                <span>Active Services</span>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                {packageCategories.map((catName) => {
                  const pkgCount = packages.filter((p) => p.category.toLowerCase() === catName.toLowerCase()).length;
                  return (
                    <div
                      key={catName}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-xs"
                    >
                      <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                        <Tag className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>{catName}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                          {pkgCount} {pkgCount === 1 ? 'tour' : 'tours'}
                        </span>
                        {isSuperAdmin && (
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(catName)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                            title={pkgCount > 0 ? `Cannot delete: ${pkgCount} tour(s) currently in this category` : 'Delete category'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-end border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setShowCategoryModal(false);
                  setCategoryModalError(null);
                  setCategoryModalSuccess(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
