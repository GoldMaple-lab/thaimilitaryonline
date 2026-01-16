import { useState, useEffect } from 'react';
import { db, auth } from './firebase';
// เพิ่ม onSnapshot เข้ามาเพื่อทำ Real-time update
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { Shield, User, FileText, Phone, LogOut, Calendar, ChevronRight, Eye, X, CheckCircle, Trash2, Clock, AlertTriangle } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login'); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center text-green-800 font-bold font-sans">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {currentPage === 'login' && <LoginPage setCurrentPage={setCurrentPage} />}
        {currentPage === 'form' && <UserFormPage setCurrentPage={setCurrentPage} />}
        {currentPage === 'admin' && <AdminPage user={user} setCurrentPage={setCurrentPage} />}
      </div>
      <Footer />
    </div>
  );
}

// ================= Header & Footer =================

const Header = () => (
  <header className="bg-gradient-to-r from-green-900 to-green-800 text-white shadow-lg sticky top-0 z-50">
    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* --- โซนเปลี่ยนโลโก้ --- */}
        <img 
            src="logo.png" 
            alt="Logo" 
            className="w-12 h-12 object-contain bg-white rounded-full p-1 shadow-md"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} 
        />
        {/* โลโก้สำรอง */}
        <div className="hidden bg-yellow-500 p-2 rounded-full shadow-inner">
          <Shield className="w-6 h-6 text-green-900" />
        </div>
        
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-wide text-yellow-50 drop-shadow-md">
            Thai Military Online
          </h1>
          <p className="text-xs text-green-200 font-light tracking-wider">ระบบบริการกำลังพลสำรองออนไลน์</p>
        </div>
      </div>
    </div>
  </header>
);

const Footer = () => (
  <footer className="text-center py-6 text-gray-400 text-xs mt-auto">
    <p>© 2026 Thai Military Online. สงวนลิขสิทธิ์ทางราชการ</p>
  </footer>
);

// ================= หน้าล็อกอิน (Login) =================
function LoginPage({ setCurrentPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user.email === 'admin@thaimilitary.online') {
        setCurrentPage('admin');
      } else {
        await signOut(auth);
        setError("เฉพาะเจ้าหน้าที่เท่านั้น");
      }
    } catch (err) {
      setError("ข้อมูลไม่ถูกต้อง");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-green-50 p-6 text-center border-b border-green-100">
          <h2 className="text-2xl font-bold text-green-800">เข้าสู่ระบบ</h2>
          <p className="text-gray-500 text-sm mt-1">เลือกสถานะเพื่อดำเนินการต่อ</p>
        </div>
        <div className="p-8 space-y-6">
          <button 
            onClick={() => setCurrentPage('form')}
            className="group w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 active:scale-95 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <User className="w-6 h-6" />
              <div className="text-left">
                <div className="font-bold text-lg">ประชาชนทั่วไป</div>
                <div className="text-yellow-100 text-xs">ติดต่อราชการ / ยื่นคำร้อง</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" />
          </button>
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase tracking-wider">สำหรับเจ้าหน้าที่</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center border border-red-100">{error}</div>}
            <div className="space-y-3">
              <input type="email" placeholder="อีเมลเจ้าหน้าที่" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="รหัสผ่าน" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="w-full bg-green-800 text-white py-3 rounded-lg font-semibold hover:bg-green-900 transition-all shadow-md">เข้าสู่ระบบ (Admin)</button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ================= หน้าฟอร์มประชาชน (User Form) =================
function UserFormPage({ setCurrentPage }) {
  const services = [
    { id: 1, name: "ลงทะเบียนทหารกองเกิน", icon: <User size={20} /> },
    { id: 2, name: "ยื่นใบคำร้องทั่วไป", icon: <FileText size={20} /> },
    { id: 3, name: "ติดต่อขึ้นทะเบียนทหาร", icon: <Shield size={20} /> },
    { id: 4, name: "ติดต่อขอใบลดสิทธิ์", icon: <FileText size={20} /> },
    { id: 5, name: "ขอใบผ่อนผันทหาร", icon: <CheckCircle size={20} /> }
  ];

  const [selectedService, setSelectedService] = useState(services[0]);
  const [formData, setFormData] = useState({ 
    fullName: '', idCard: '', phone: '', facebook: '', lineId: '', email: '', appointmentDate: '' 
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.idCard.length !== 13) return alert("เลขบัตรประชาชนต้องครบ 13 หลัก");
    if(!formData.appointmentDate) return alert("กรุณาเลือกวันและเวลานัดหมาย");

    setSubmitting(true);
    try {
      await addDoc(collection(db, "military_requests"), {
        serviceType: selectedService.name,
        ...formData,
        status: 'pending',
        timestamp: serverTimestamp()
      });
      alert(`บันทึกข้อมูลเรียบร้อย เจ้าหน้าที่จะติดต่อกลับ`);
      setFormData({ fullName: '', idCard: '', phone: '', facebook: '', lineId: '', email: '', appointmentDate: '' });
    } catch (error) {
      alert("เกิดข้อผิดพลาด");
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <button onClick={() => setCurrentPage('login')} className="mb-6 flex items-center text-gray-500 hover:text-green-700 transition-colors">
        <ChevronRight className="rotate-180 w-4 h-4 mr-1" /> กลับหน้าหลัก
      </button>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        <div className="md:w-1/3 bg-green-50 p-6 border-r border-green-100">
          <h2 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2"><FileText className="w-5 h-5" /> เลือกรายการติดต่อ</h2>
          <div className="space-y-2">
            {services.map(s => (
              <button key={s.id} onClick={() => setSelectedService(s)} 
                className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all duration-200 ${selectedService.id === s.id ? 'bg-green-700 text-white shadow-lg translate-x-1' : 'bg-white text-gray-600 hover:bg-green-100 hover:pl-4 shadow-sm'}`}>
                <span className={selectedService.id === s.id ? 'text-yellow-400' : 'text-green-700'}>{s.icon}</span>
                <span className="font-medium text-sm">{s.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="md:w-2/3 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b">{selectedService.name}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div><label className="text-sm font-semibold mb-1 block">ชื่อ-นามสกุล</label><input required className="w-full px-4 py-2 border rounded-lg" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} /></div>
                    <div><label className="text-sm font-semibold mb-1 block">เลขบัตรประชาชน (13 หลัก)</label><input required maxLength="13" className="w-full px-4 py-2 border rounded-lg font-mono" value={formData.idCard} onChange={e => setFormData({...formData, idCard: e.target.value.replace(/[^0-9]/g, '')})} /></div>
                </div>
                
                {/* --- แก้ไข: เพิ่มหมายเหตุกลับมาแล้ว --- */}
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                    <label className="text-sm font-bold text-yellow-800 mb-2 flex items-center gap-2"><Calendar className="w-4 h-4" /> เลือกวันและเวลานัดหมาย</label>
                    <input type="datetime-local" required className="w-full px-4 py-2 bg-white border border-yellow-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-yellow-400 outline-none" value={formData.appointmentDate} onChange={e => setFormData({...formData, appointmentDate: e.target.value})} />
                    <p className="text-xs text-red-600 mt-2 font-semibold">* กรุณามาติดต่อก่อนเวลานัดหมาย 15 นาที</p>
                </div>
                {/* ---------------------------------- */}

                <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"><Phone className="w-4 h-4" /> ช่องทางติดต่อกลับ</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input placeholder="เบอร์โทรศัพท์" className="border rounded-lg p-2" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        <input placeholder="Line ID" className="border rounded-lg p-2" value={formData.lineId} onChange={e => setFormData({...formData, lineId: e.target.value})} />
                        <input placeholder="Facebook" className="border rounded-lg p-2" value={formData.facebook} onChange={e => setFormData({...formData, facebook: e.target.value})} />
                        <input placeholder="Email" className="border rounded-lg p-2" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                </div>
                <button type="submit" disabled={submitting} className="w-full bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-800 shadow-lg disabled:bg-gray-400">ยืนยันการนัดหมาย</button>
            </form>
        </div>
      </div>
    </div>
  );
}

// ================= หน้า Admin (Admin Dashboard) =================
function AdminPage({ user, setCurrentPage }) {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState('pending'); // pending, accepted, overdue

  // --- แก้ไข: ใช้ onSnapshot เพื่อดึงข้อมูลแบบ Real-time ---
  useEffect(() => {
    const q = query(collection(db, "military_requests"), orderBy("timestamp", "desc"));
    
    // เมื่อฐานข้อมูลเปลี่ยน ฟังก์ชันนี้จะทำงานทันที
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe(); // ยกเลิกการฟังเมื่อปิดหน้านี้
  }, []);
  // -----------------------------------------------------

  const isOverdue = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  const getFilteredRequests = () => {
    return requests.filter(req => {
      if (activeTab === 'accepted') return req.status === 'accepted';
      
      const overdue = isOverdue(req.appointmentDate);
      if (activeTab === 'overdue') return req.status !== 'accepted' && overdue;
      if (activeTab === 'pending') return req.status !== 'accepted' && !overdue;
      return false;
    });
  };

  const handleAccept = async (req) => {
    if (confirm(`ต้องการรับเรื่องของ "${req.fullName}" ใช่หรือไม่?`)) {
        // แก้ไข: ไม่ต้อง update state เอง รอ onSnapshot จัดการให้
        await updateDoc(doc(db, "military_requests", req.id), { status: 'accepted' });
        setSelectedRequest(null);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("ยืนยันที่จะลบข้อมูลนี้ถาวร?")) {
        await deleteDoc(doc(db, "military_requests", id));
        setSelectedRequest(null);
    }
  };

  const handleLogout = () => { signOut(auth); setCurrentPage('login'); };

  return (
    <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div>
                <h1 className="text-2xl font-bold text-green-900 flex items-center gap-2"> แผงควบคุมเจ้าหน้าที่</h1>
                <p className="text-gray-500 text-sm mt-1">เจ้าหน้าที่: Thai Military </p>
            </div>
            <button onClick={handleLogout} className="mt-4 md:mt-0 flex items-center gap-2 bg-red-100 text-red-600 px-5 py-2 rounded-lg hover:bg-red-200 transition-colors font-semibold">
                <LogOut size={18} /> ออกจากระบบ
            </button>
        </div>

        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
            <TabButton 
                active={activeTab === 'pending'} 
                onClick={() => setActiveTab('pending')} 
                icon={<Clock size={18} />} 
                label="งานใหม่ (ยังไม่รับเรื่อง)" 
                count={requests.filter(r => r.status !== 'accepted' && !isOverdue(r.appointmentDate)).length}
                colorClass="bg-blue-600"
            />
            <TabButton 
                active={activeTab === 'accepted'} 
                onClick={() => setActiveTab('accepted')} 
                icon={<CheckCircle size={18} />} 
                label="รับเรื่องแล้ว" 
                count={requests.filter(r => r.status === 'accepted').length}
                colorClass="bg-green-600"
            />
            <TabButton 
                active={activeTab === 'overdue'} 
                onClick={() => setActiveTab('overdue')} 
                icon={<AlertTriangle size={18} />} 
                label="งานค้าง / เกินกำหนด" 
                count={requests.filter(r => r.status !== 'accepted' && isOverdue(r.appointmentDate)).length}
                colorClass="bg-red-600"
            />
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden min-h-[400px]">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-green-800 text-white text-sm uppercase tracking-wider">
                        <th className="p-4 font-medium">เวลานัดหมาย</th>
                        <th className="p-4 font-medium">เรื่อง</th>
                        <th className="p-4 font-medium">ชื่อ-นามสกุล</th>
                        <th className="p-4 font-medium text-center">จัดการ</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {getFilteredRequests().map((req) => (
                        <tr key={req.id} className="hover:bg-green-50 transition-colors">
                            <td className="p-4 text-sm font-semibold text-gray-700">
                                {req.appointmentDate ? new Date(req.appointmentDate).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' }) : '-'}
                            </td>
                            <td className="p-4 font-semibold text-green-800">{req.serviceType}</td>
                            <td className="p-4 text-gray-700">{req.fullName}</td>
                            <td className="p-4 text-center">
                                <button onClick={() => setSelectedRequest(req)} className="bg-white border border-green-600 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-green-600 hover:text-white transition-all shadow-sm flex items-center gap-2 mx-auto">
                                    <Eye size={14} /> ตรวจสอบ
                                </button>
                            </td>
                        </tr>
                    ))}
                    {getFilteredRequests().length === 0 && (
                        <tr><td colSpan="4" className="p-10 text-center text-gray-400">-- ไม่มีรายการในหมวดนี้ --</td></tr>
                    )}
                </tbody>
            </table>
        </div>

        {selectedRequest && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedRequest(null)}>
                <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-bounce-in" onClick={e => e.stopPropagation()}>
                    <div className="bg-green-800 text-white p-4 flex justify-between items-center">
                        <h3 className="text-lg font-bold flex items-center gap-2"><FileText size={20} /> รายละเอียดคำร้อง</h3>
                        <button onClick={() => setSelectedRequest(null)}><X size={24} /></button>
                    </div>
                    
                    <div className="p-6 space-y-4">
                        {activeTab === 'overdue' && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-center font-bold">⚠️ รายการนี้เกินเวลานัดหมายแล้ว</div>}
                        {activeTab === 'accepted' && <div className="bg-green-100 text-green-700 p-3 rounded-lg text-center font-bold">✅ รับเรื่องเรียบร้อยแล้ว</div>}

                        <div className="flex items-center gap-3 mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="bg-yellow-500 text-white p-2 rounded-full"><Calendar size={20} /></div>
                            <div>
                                <p className="text-xs text-yellow-800 font-bold uppercase">เวลานัดหมาย</p>
                                <p className="text-gray-800 font-semibold text-lg">{selectedRequest.appointmentDate ? new Date(selectedRequest.appointmentDate).toLocaleString('th-TH') : '-'}</p>
                            </div>
                        </div>

                        <InfoRow label="เรื่อง" value={selectedRequest.serviceType} />
                        <InfoRow label="ชื่อ-นามสกุล" value={selectedRequest.fullName} />
                        <InfoRow label="เลขบัตรประชาชน" value={selectedRequest.idCard} isMono />
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-sm font-bold text-gray-500 mb-3">ช่องทางติดต่อกลับ</p>
                            <div className="grid grid-cols-2 gap-3">
                                <ContactBadge label="เบอร์โทร" value={selectedRequest.phone} />
                                <ContactBadge label="Line ID" value={selectedRequest.lineId} color="green" />
                                <ContactBadge label="Facebook" value={selectedRequest.facebook} color="blue" />
                                <ContactBadge label="Email" value={selectedRequest.email} />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 flex gap-3 justify-end border-t border-gray-100">
                        <button onClick={() => handleDelete(selectedRequest.id)} className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-200 flex items-center gap-2">
                            <Trash2 size={18} /> ลบรายการ
                        </button>
                        
                        {selectedRequest.status !== 'accepted' && (
                            <button onClick={() => handleAccept(selectedRequest)} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 shadow-md flex items-center gap-2">
                                <CheckCircle size={18} /> รับทราบเรื่อง
                            </button>
                        )}
                        
                        {selectedRequest.status === 'accepted' && (
                            <button onClick={() => setSelectedRequest(null)} className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg font-medium hover:bg-gray-300">
                                ปิดหน้าต่าง
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}

const TabButton = ({ active, onClick, icon, label, count, colorClass }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold transition-all whitespace-nowrap shadow-sm ${
            active ? `${colorClass} text-white shadow-md transform scale-105` : 'bg-white text-gray-600 hover:bg-gray-50'
        }`}
    >
        {icon}
        {label}
        {count > 0 && <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full ml-1">{count}</span>}
    </button>
);

const InfoRow = ({ label, value, isMono }) => (
    <div className="border-b border-gray-100 last:border-0 py-2">
        <span className="text-sm text-gray-500 block">{label}</span>
        <span className={`text-gray-800 font-medium ${isMono ? 'font-mono tracking-wider' : ''}`}>{value || '-'}</span>
    </div>
);

const ContactBadge = ({ label, value, color = 'gray' }) => {
    if (!value) return null;
    const colors = { gray: 'bg-gray-100 text-gray-700', green: 'bg-green-100 text-green-700', blue: 'bg-blue-100 text-blue-700' };
    return (
        <div className={`${colors[color]} px-3 py-2 rounded-lg text-sm`}>
            <span className="opacity-70 text-xs block">{label}</span>
            <span className="font-medium truncate block">{value}</span>
        </div>
    );
};

export default App;