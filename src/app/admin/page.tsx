'use client';

import React, { useState, useEffect } from 'react';
import {
  Lock,
  ChefHat,
  Bike,
  CheckCircle2,
  Clock,
  RefreshCw,
  LogOut,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  Phone,
  MapPin,
  Check,
  XCircle,
} from 'lucide-react';

interface OrderItemData {
  id: string;
  name: string;
  size: string;
  crust: string;
  quantity: number;
  price: number;
}

interface OrderData {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryType: string;
  totalAmount: number;
  status: 'Pending' | 'Preparing' | 'Dispatched' | 'Delivered' | 'Cancelled';
  createdAt: string;
  items: OrderItemData[];
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard state
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Check saved session
  useEffect(() => {
    const session = localStorage.getItem('potsandstones_admin_auth');
    if (session === 'true') {
      setIsAuthenticated(true);
      fetchOrders();
    }
  }, []);

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error('Failed to fetch orders:', e);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  // Poll orders every 8 seconds when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(fetchOrders, 8000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: adminId, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('potsandstones_admin_auth', 'true');
        fetchOrders();
      } else {
        setLoginError(data.message || 'Invalid Credentials');
      }
    } catch (err) {
      setLoginError('Failed to connect to authentication server');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('potsandstones_admin_auth');
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderData['status']) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (e) {
      console.error('Failed to update status:', e);
    } finally {
      setUpdatingId(null);
    }
  };

  // 1. LOGIN GATE
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-[#231b15]">
        <div className="w-full max-w-md bg-slate-900/90 border border-amber-900/40 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-900/40 text-3xl">
              ☕
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">Pots & Stones</h1>
            <p className="text-xs font-semibold text-amber-200/80 mt-1 uppercase tracking-wider">
              Coffee & Eatery • Kitchen Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Username / ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="Enter admin ID (default: admin)"
                  required
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (default: pots123)"
                  required
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all"
                />
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-red-900/40 border border-red-700/60 rounded-xl text-red-200 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-amber-700 hover:bg-amber-800 active:scale-[0.99] disabled:opacity-70 text-white font-black py-3.5 px-4 rounded-xl text-sm tracking-wide shadow-lg shadow-amber-900/40 transition-all flex items-center justify-center space-x-2"
              >
                <Lock className="w-4 h-4" />
                <span>{isLoggingIn ? 'AUTHENTICATING...' : 'ACCESS ADMIN DASHBOARD'}</span>
              </button>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
              <p className="text-[11px] text-slate-400 font-mono">
                Default Credentials: <strong className="text-white">admin</strong> / <strong className="text-white">pots123</strong>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED ADMIN DASHBOARD
  const filteredOrders =
    selectedStatus === 'All' ? orders : orders.filter((o) => o.status === selectedStatus);

  const pendingCount = orders.filter((o) => o.status === 'Pending').length;
  const preparingCount = orders.filter((o) => o.status === 'Preparing').length;
  const dispatchedCount = orders.filter((o) => o.status === 'Dispatched').length;
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const getStatusBadge = (status: OrderData['status']) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center space-x-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
      case 'Preparing':
        return (
          <span className="inline-flex items-center space-x-1 bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-black px-2.5 py-1 rounded-full">
            <ChefHat className="w-3 h-3" />
            <span>In Kitchen</span>
          </span>
        );
      case 'Dispatched':
        return (
          <span className="inline-flex items-center space-x-1 bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[11px] font-black px-2.5 py-1 rounded-full">
            <Bike className="w-3 h-3" />
            <span>On the Way</span>
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center space-x-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-black px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            <span>Delivered</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center space-x-1 bg-red-500/20 text-red-300 border border-red-500/40 text-[11px] font-black px-2.5 py-1 rounded-full">
            <XCircle className="w-3 h-3" />
            <span>Cancelled</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-amber-900/30 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-amber-700 rounded-xl flex items-center justify-center text-xl shadow-md">
            ☕
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-black text-white">Pots & Stones Kitchen & Dispatch</h1>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">Kathgodam, Haldwani Store #01</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={fetchOrders}
            disabled={isLoadingOrders}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingOrders ? 'animate-spin text-amber-500' : ''}`} />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 bg-red-950/60 hover:bg-red-900/80 border border-red-800/60 text-red-300 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 space-y-6">
        {/* KPI Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Total Orders</span>
              <ShoppingBag className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white mt-1.5">{orders.length}</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center justify-between text-amber-400 text-xs font-bold">
              <span>Pending</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-amber-300 mt-1.5">{pendingCount}</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center justify-between text-blue-400 text-xs font-bold">
              <span>In Kitchen</span>
              <ChefHat className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-black text-blue-300 mt-1.5">{preparingCount}</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center justify-between text-purple-400 text-xs font-bold">
              <span>Dispatched</span>
              <Bike className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-black text-purple-300 mt-1.5">{dispatchedCount}</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-emerald-400 text-xs font-bold">
              <span>Gross Sales</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-emerald-300 mt-1.5">₹{totalRevenue}</p>
          </div>
        </div>

        {/* Filter Status Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
          {['All', 'Pending', 'Preparing', 'Dispatched', 'Delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 ${
                selectedStatus === status
                  ? 'bg-amber-700 text-white shadow-md shadow-amber-900/40'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {status === 'All' ? `All Orders (${orders.length})` : status}
            </button>
          ))}
        </div>

        {/* Orders List / Grid */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center">
              <div className="w-14 h-14 bg-slate-800 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                📋
              </div>
              <h3 className="text-base font-extrabold text-slate-300">No orders in this category</h3>
              <p className="text-xs text-slate-500 mt-1">
                New customer orders placed from the app will appear here instantly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map((order) => {
                const isUpdating = updatingId === order.id;

                return (
                  <div
                    key={order.id}
                    className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-xl flex flex-col justify-between space-y-3 transition-all"
                  >
                    {/* Order ID & Status Header */}
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                        <div>
                          <span className="font-mono font-black text-sm text-white">{order.id}</span>
                          <span className="text-[10px] text-slate-400 block">
                            {new Date(order.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div>{getStatusBadge(order.status)}</div>
                      </div>

                      {/* Customer Info */}
                      <div className="py-2 space-y-1 text-xs text-slate-300">
                        <p className="font-extrabold text-white">{order.customerName}</p>
                        <div className="flex items-center space-x-1.5 text-slate-400 text-[11px]">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{order.customerPhone}</span>
                        </div>
                        <div className="flex items-start space-x-1.5 text-slate-400 text-[11px]">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{order.deliveryAddress}</span>
                        </div>
                      </div>

                      {/* Item Breakdown */}
                      <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80 space-y-2 mt-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                          Ordered Items
                        </span>
                        <div className="space-y-1.5 divide-y divide-slate-800/60">
                          {order.items?.map((it, idx) => (
                            <div key={idx} className="pt-1.5 first:pt-0 flex items-start justify-between text-xs">
                              <div>
                                <span className="font-bold text-slate-200">
                                  {it.quantity}x {it.name}
                                </span>
                                <div className="text-[10px] text-slate-400 space-x-1.5">
                                  {it.size !== 'Standard' && <span>Size: {it.size}</span>}
                                  {it.crust !== 'Standard' && <span>• {it.crust}</span>}
                                </div>
                              </div>
                              <span className="font-bold text-slate-300 text-[11px]">₹{it.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Total & Action Buttons */}
                    <div className="pt-2 border-t border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Total Bill Amount</span>
                        <span className="text-base font-black text-amber-500">₹{order.totalAmount}</span>
                      </div>

                      {/* 1-Click Status Flow Action Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        {order.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(order.id, 'Preparing')}
                              disabled={isUpdating}
                              className="col-span-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs py-2 rounded-xl flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
                            >
                              <ChefHat className="w-3.5 h-3.5" />
                              <span>Accept & Send to Kitchen</span>
                            </button>
                          </>
                        )}

                        {order.status === 'Preparing' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(order.id, 'Dispatched')}
                              disabled={isUpdating}
                              className="col-span-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs py-2 rounded-xl flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
                            >
                              <Bike className="w-3.5 h-3.5" />
                              <span>Dispatch Order</span>
                            </button>
                          </>
                        )}

                        {order.status === 'Dispatched' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(order.id, 'Delivered')}
                              disabled={isUpdating}
                              className="col-span-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-2 rounded-xl flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Mark Delivered</span>
                            </button>
                          </>
                        )}

                        {order.status === 'Delivered' && (
                          <div className="col-span-2 bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-center text-xs font-bold py-2 rounded-xl">
                            ✓ Order Completed
                          </div>
                        )}

                        {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'Cancelled')}
                            disabled={isUpdating}
                            className="col-span-2 bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-300 text-[11px] font-bold py-1.5 rounded-lg transition-colors"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
