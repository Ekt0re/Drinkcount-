import React, { useState, useEffect } from 'react';
import { Plus, Settings, Users, TrendingUp, X, Check } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DrinkTracker() {
  const [friends, setFriends] = useState([
    { id: 1, name: 'Io', color: '#3b82f6' }
  ]);
  const [selectedFriend, setSelectedFriend] = useState(1);
  const [drinks, setDrinks] = useState([]);
  const [view, setView] = useState('main');
  const [newFriendName, setNewFriendName] = useState('');
  const [settings, setSettings] = useState({
    drink: 5,
    beer: 4.5,
    shot: 40
  });
  const [tempSettings, setTempSettings] = useState(settings);

  const addDrink = (type) => {
    const newDrink = {
      id: Date.now(),
      friendId: selectedFriend,
      type,
      timestamp: new Date().toISOString(),
      alcohol: settings[type]
    };
    setDrinks([...drinks, newDrink]);
  };

  const addFriend = () => {
    if (newFriendName.trim()) {
      const colors = ['#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
      const newFriend = {
        id: Date.now(),
        name: newFriendName.trim(),
        color: colors[friends.length % colors.length]
      };
      setFriends([...friends, newFriend]);
      setNewFriendName('');
    }
  };

  const removeFriend = (id) => {
    if (friends.length > 1) {
      setFriends(friends.filter(f => f.id !== id));
      if (selectedFriend === id) {
        setSelectedFriend(friends[0].id);
      }
      setDrinks(drinks.filter(d => d.friendId !== id));
    }
  };

  const saveSettings = () => {
    setSettings(tempSettings);
    setView('main');
  };

  const getChartData = () => {
    const hourlyData = {};
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

    for (let i = 0; i < 24; i++) {
      const hour = `${i.toString().padStart(2, '0')}:00`;
      hourlyData[hour] = { time: hour };
      friends.forEach(f => {
        hourlyData[hour][f.name] = 0;
      });
    }

    drinks.forEach(drink => {
      const drinkDate = new Date(drink.timestamp);
      if (drinkDate >= startOfDay) {
        const hour = `${drinkDate.getHours().toString().padStart(2, '0')}:00`;
        const friend = friends.find(f => f.id === drink.friendId);
        if (friend && hourlyData[hour]) {
          hourlyData[hour][friend.name] = (hourlyData[hour][friend.name] || 0) + 1;
        }
      }
    });

    return Object.values(hourlyData);
  };

  const getFriendStats = (friendId) => {
    const friendDrinks = drinks.filter(d => d.friendId === friendId);
    return {
      total: friendDrinks.length,
      drinks: friendDrinks.filter(d => d.type === 'drink').length,
      beers: friendDrinks.filter(d => d.type === 'beer').length,
      shots: friendDrinks.filter(d => d.type === 'shot').length
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Drink Tracker
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setView(view === 'stats' ? 'main' : 'stats')}
              className={`p-3 rounded-xl transition ${
                view === 'stats'
                  ? 'bg-purple-600'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <TrendingUp size={20} />
            </button>
            <button
              onClick={() => setView(view === 'friends' ? 'main' : 'friends')}
              className={`p-3 rounded-xl transition ${
                view === 'friends'
                  ? 'bg-purple-600'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <Users size={20} />
            </button>
            <button
              onClick={() => {
                setTempSettings(settings);
                setView(view === 'settings' ? 'main' : 'settings');
              }}
              className={`p-3 rounded-xl transition ${
                view === 'settings'
                  ? 'bg-purple-600'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Main View */}
        {view === 'main' && (
          <>
            {/* Friend Selector */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-6">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {friends.map(friend => (
                  <button
                    key={friend.id}
                    onClick={() => setSelectedFriend(friend.id)}
                    className={`px-6 py-3 rounded-xl whitespace-nowrap transition font-medium ${
                      selectedFriend === friend.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-105'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                    style={{
                      borderColor: selectedFriend === friend.id ? friend.color : 'transparent',
                      borderWidth: '2px'
                    }}
                  >
                    {friend.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Drink Buttons */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <button
                onClick={() => addDrink('drink')}
                className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 p-8 rounded-2xl transition transform hover:scale-105 active:scale-95"
              >
                <div className="text-5xl mb-2">🍹</div>
                <div className="font-bold text-lg">Drink</div>
                <div className="text-sm opacity-80">{settings.drink}%</div>
              </button>
              <button
                onClick={() => addDrink('beer')}
                className="bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 p-8 rounded-2xl transition transform hover:scale-105 active:scale-95"
              >
                <div className="text-5xl mb-2">🍺</div>
                <div className="font-bold text-lg">Birra</div>
                <div className="text-sm opacity-80">{settings.beer}%</div>
              </button>
              <button
                onClick={() => addDrink('shot')}
                className="bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 p-8 rounded-2xl transition transform hover:scale-105 active:scale-95"
              >
                <div className="text-5xl mb-2">🥃</div>
                <div className="font-bold text-lg">Shot</div>
                <div className="text-sm opacity-80">{settings.shot}%</div>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4">Oggi</h3>
              <div className="grid grid-cols-3 gap-4">
                {friends.map(friend => {
                  const stats = getFriendStats(friend.id);
                  return (
                    <div key={friend.id} className="text-center">
                      <div
                        className="text-3xl font-bold mb-1"
                        style={{ color: friend.color }}
                      >
                        {stats.total}
                      </div>
                      <div className="text-sm opacity-70">{friend.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Stats View */}
        {view === 'stats' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <h3 className="font-bold text-xl mb-6">Grafico Giornaliero</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: 'none',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                {friends.map(friend => (
                  <Line
                    key={friend.id}
                    type="monotone"
                    dataKey={friend.name}
                    stroke={friend.color}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-8 space-y-4">
              {friends.map(friend => {
                const stats = getFriendStats(friend.id);
                return (
                  <div key={friend.id} className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: friend.color }}
                        />
                        <span className="font-bold">{friend.name}</span>
                      </div>
                      <span className="text-2xl font-bold">{stats.total}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center">
                        <div className="text-blue-400 font-bold">{stats.drinks}</div>
                        <div className="opacity-70">Drink</div>
                      </div>
                      <div className="text-center">
                        <div className="text-amber-400 font-bold">{stats.beers}</div>
                        <div className="opacity-70">Birre</div>
                      </div>
                      <div className="text-center">
                        <div className="text-red-400 font-bold">{stats.shots}</div>
                        <div className="opacity-70">Shot</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Friends View */}
        {view === 'friends' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <h3 className="font-bold text-xl mb-6">Gestione Amici</h3>
            
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={newFriendName}
                onChange={(e) => setNewFriendName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addFriend()}
                placeholder="Nome amico..."
                className="flex-1 bg-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={addFriend}
                className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl hover:opacity-90 transition"
              >
                <Plus size={24} />
              </button>
            </div>

            <div className="space-y-3">
              {friends.map(friend => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between bg-white/5 rounded-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: friend.color }}
                    />
                    <span className="font-medium">{friend.name}</span>
                  </div>
                  {friends.length > 1 && (
                    <button
                      onClick={() => removeFriend(friend.id)}
                      className="text-red-400 hover:text-red-300 transition p-2"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings View */}
        {view === 'settings' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <h3 className="font-bold text-xl mb-6">Impostazioni Alcool</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block mb-2 font-medium">🍹 Drink (%)</label>
                <input
                  type="number"
                  value={tempSettings.drink}
                  onChange={(e) => setTempSettings({...tempSettings, drink: parseFloat(e.target.value) || 0})}
                  className="w-full bg-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.1"
                  min="0"
                  max="100"
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium">🍺 Birra (%)</label>
                <input
                  type="number"
                  value={tempSettings.beer}
                  onChange={(e) => setTempSettings({...tempSettings, beer: parseFloat(e.target.value) || 0})}
                  className="w-full bg-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500"
                  step="0.1"
                  min="0"
                  max="100"
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium">🥃 Shot (%)</label>
                <input
                  type="number"
                  value={tempSettings.shot}
                  onChange={(e) => setTempSettings({...tempSettings, shot: parseFloat(e.target.value) || 0})}
                  className="w-full bg-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                  step="0.1"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <button
              onClick={saveSettings}
              className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-xl font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <Check size={20} />
              Salva Impostazioni
            </button>
          </div>
        )}
      </div>
    </div>
  );
}import React, { useState, useEffect } from 'react';
import { Plus, Settings, Users, TrendingUp, X, Check } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DrinkTracker() {
  const [friends, setFriends] = useState([
    { id: 1, name: 'Io', color: '#3b82f6' }
  ]);
  const [selectedFriend, setSelectedFriend] = useState(1);
  const [drinks, setDrinks] = useState([]);
  const [view, setView] = useState('main');
  const [newFriendName, setNewFriendName] = useState('');
  const [settings, setSettings] = useState({
    drink: 5,
    beer: 4.5,
    shot: 40
  });
  const [tempSettings, setTempSettings] = useState(settings);

  const addDrink = (type) => {
    const newDrink = {
      id: Date.now(),
      friendId: selectedFriend,
      type,
      timestamp: new Date().toISOString(),
      alcohol: settings[type]
    };
    setDrinks([...drinks, newDrink]);
  };

  const addFriend = () => {
    if (newFriendName.trim()) {
      const colors = ['#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
      const newFriend = {
        id: Date.now(),
        name: newFriendName.trim(),
        color: colors[friends.length % colors.length]
      };
      setFriends([...friends, newFriend]);
      setNewFriendName('');
    }
  };

  const removeFriend = (id) => {
    if (friends.length > 1) {
      setFriends(friends.filter(f => f.id !== id));
      if (selectedFriend === id) {
        setSelectedFriend(friends[0].id);
      }
      setDrinks(drinks.filter(d => d.friendId !== id));
    }
  };

  const saveSettings = () => {
    setSettings(tempSettings);
    setView('main');
  };

  const getChartData = () => {
    const hourlyData = {};
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

    for (let i = 0; i < 24; i++) {
      const hour = `${i.toString().padStart(2, '0')}:00`;
      hourlyData[hour] = { time: hour };
      friends.forEach(f => {
        hourlyData[hour][f.name] = 0;
      });
    }

    drinks.forEach(drink => {
      const drinkDate = new Date(drink.timestamp);
      if (drinkDate >= startOfDay) {
        const hour = `${drinkDate.getHours().toString().padStart(2, '0')}:00`;
        const friend = friends.find(f => f.id === drink.friendId);
        if (friend && hourlyData[hour]) {
          hourlyData[hour][friend.name] = (hourlyData[hour][friend.name] || 0) + 1;
        }
      }
    });

    return Object.values(hourlyData);
  };

  const getFriendStats = (friendId) => {
    const friendDrinks = drinks.filter(d => d.friendId === friendId);
    return {
      total: friendDrinks.length,
      drinks: friendDrinks.filter(d => d.type === 'drink').length,
      beers: friendDrinks.filter(d => d.type === 'beer').length,
      shots: friendDrinks.filter(d => d.type === 'shot').length
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Drink Tracker
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setView(view === 'stats' ? 'main' : 'stats')}
              className={`p-3 rounded-xl transition ${
                view === 'stats'
                  ? 'bg-purple-600'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <TrendingUp size={20} />
            </button>
            <button
              onClick={() => setView(view === 'friends' ? 'main' : 'friends')}
              className={`p-3 rounded-xl transition ${
                view === 'friends'
                  ? 'bg-purple-600'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <Users size={20} />
            </button>
            <button
              onClick={() => {
                setTempSettings(settings);
                setView(view === 'settings' ? 'main' : 'settings');
              }}
              className={`p-3 rounded-xl transition ${
                view === 'settings'
                  ? 'bg-purple-600'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Main View */}
        {view === 'main' && (
          <>
            {/* Friend Selector */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-6">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {friends.map(friend => (
                  <button
                    key={friend.id}
                    onClick={() => setSelectedFriend(friend.id)}
                    className={`px-6 py-3 rounded-xl whitespace-nowrap transition font-medium ${
                      selectedFriend === friend.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-105'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                    style={{
                      borderColor: selectedFriend === friend.id ? friend.color : 'transparent',
                      borderWidth: '2px'
                    }}
                  >
                    {friend.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Drink Buttons */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <button
                onClick={() => addDrink('drink')}
                className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 p-8 rounded-2xl transition transform hover:scale-105 active:scale-95"
              >
                <div className="text-5xl mb-2">🍹</div>
                <div className="font-bold text-lg">Drink</div>
                <div className="text-sm opacity-80">{settings.drink}%</div>
              </button>
              <button
                onClick={() => addDrink('beer')}
                className="bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 p-8 rounded-2xl transition transform hover:scale-105 active:scale-95"
              >
                <div className="text-5xl mb-2">🍺</div>
                <div className="font-bold text-lg">Birra</div>
                <div className="text-sm opacity-80">{settings.beer}%</div>
              </button>
              <button
                onClick={() => addDrink('shot')}
                className="bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 p-8 rounded-2xl transition transform hover:scale-105 active:scale-95"
              >
                <div className="text-5xl mb-2">🥃</div>
                <div className="font-bold text-lg">Shot</div>
                <div className="text-sm opacity-80">{settings.shot}%</div>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4">Oggi</h3>
              <div className="grid grid-cols-3 gap-4">
                {friends.map(friend => {
                  const stats = getFriendStats(friend.id);
                  return (
                    <div key={friend.id} className="text-center">
                      <div
                        className="text-3xl font-bold mb-1"
                        style={{ color: friend.color }}
                      >
                        {stats.total}
                      </div>
                      <div className="text-sm opacity-70">{friend.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Stats View */}
        {view === 'stats' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <h3 className="font-bold text-xl mb-6">Grafico Giornaliero</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: 'none',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                {friends.map(friend => (
                  <Line
                    key={friend.id}
                    type="monotone"
                    dataKey={friend.name}
                    stroke={friend.color}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-8 space-y-4">
              {friends.map(friend => {
                const stats = getFriendStats(friend.id);
                return (
                  <div key={friend.id} className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: friend.color }}
                        />
                        <span className="font-bold">{friend.name}</span>
                      </div>
                      <span className="text-2xl font-bold">{stats.total}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center">
                        <div className="text-blue-400 font-bold">{stats.drinks}</div>
                        <div className="opacity-70">Drink</div>
                      </div>
                      <div className="text-center">
                        <div className="text-amber-400 font-bold">{stats.beers}</div>
                        <div className="opacity-70">Birre</div>
                      </div>
                      <div className="text-center">
                        <div className="text-red-400 font-bold">{stats.shots}</div>
                        <div className="opacity-70">Shot</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Friends View */}
        {view === 'friends' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <h3 className="font-bold text-xl mb-6">Gestione Amici</h3>
            
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={newFriendName}
                onChange={(e) => setNewFriendName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addFriend()}
                placeholder="Nome amico..."
                className="flex-1 bg-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={addFriend}
                className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl hover:opacity-90 transition"
              >
                <Plus size={24} />
              </button>
            </div>

            <div className="space-y-3">
              {friends.map(friend => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between bg-white/5 rounded-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: friend.color }}
                    />
                    <span className="font-medium">{friend.name}</span>
                  </div>
                  {friends.length > 1 && (
                    <button
                      onClick={() => removeFriend(friend.id)}
                      className="text-red-400 hover:text-red-300 transition p-2"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings View */}
        {view === 'settings' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <h3 className="font-bold text-xl mb-6">Impostazioni Alcool</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block mb-2 font-medium">🍹 Drink (%)</label>
                <input
                  type="number"
                  value={tempSettings.drink}
                  onChange={(e) => setTempSettings({...tempSettings, drink: parseFloat(e.target.value) || 0})}
                  className="w-full bg-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.1"
                  min="0"
                  max="100"
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium">🍺 Birra (%)</label>
                <input
                  type="number"
                  value={tempSettings.beer}
                  onChange={(e) => setTempSettings({...tempSettings, beer: parseFloat(e.target.value) || 0})}
                  className="w-full bg-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500"
                  step="0.1"
                  min="0"
                  max="100"
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium">🥃 Shot (%)</label>
                <input
                  type="number"
                  value={tempSettings.shot}
                  onChange={(e) => setTempSettings({...tempSettings, shot: parseFloat(e.target.value) || 0})}
                  className="w-full bg-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                  step="0.1"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <button
              onClick={saveSettings}
              className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-xl font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <Check size={20} />
              Salva Impostazioni
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
