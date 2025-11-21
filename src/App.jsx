// App.js
import React, { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  User,
  Bell,
  Car,
  Settings,
  CreditCard,
  HelpCircle,
  LogOut,
  Search,
  Check,
  ArrowLeft,
} from "lucide-react";

const BASE_URL = "https://sv-brahian-4etmp3w2kiofg.azurewebsites.net";

// --- Styles (basados en tu segundo código) ---
const styles = {
  container: {
    width: "100%",
    maxWidth: "448px",
    height: "100vh",
    backgroundColor: "#1c2120",
    display: "flex",
    flexDirection: "column",
    margin: "0 auto",
    position: "relative",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    backgroundColor: "#5170ff",
    padding: "16px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  headerTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#ffffff",
    margin: "0 0 4px 0",
  },
  headerSubtitle: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.8)",
    margin: 0,
  },
  searchBar: { backgroundColor: "#5170ff", padding: "16px" },
  searchInput: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: "8px",
    padding: "12px",
  },
  input: {
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    flex: 1,
    color: "#ffffff",
    fontSize: "14px",
  },
  content: { flex: 1, overflow: "auto", backgroundColor: "#1c2120", padding: "16px" },
  card: {
    backgroundColor: "#2a2f2e",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "16px",
    border: "1px solid #3a3f3e",
  },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" },
  cardTitle: { fontSize: "18px", fontWeight: "bold", color: "#ffffff", margin: 0 },
  cardSubtitle: { fontSize: "14px", color: "#9ca3af", margin: "4px 0 0 0" },
  badge: { backgroundColor: "rgba(34, 197, 94, 0.2)", color: "#4ade80", padding: "4px 12px", borderRadius: "12px", fontSize: "14px", fontWeight: "600" },
  iconContainer: { backgroundColor: "#5170ff", padding: "12px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" },
  button: {
    backgroundColor: "#5170ff",
    color: "#ffffff",
    padding: "8px 24px",
    borderRadius: "8px",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
  },
  bottomNav: { backgroundColor: "#2a2f2e", borderTop: "1px solid #3a3f3e", display: "flex", justifyContent: "space-around", padding: "12px 0" },
  navButton: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", border: "none", background: "none", cursor: "pointer", padding: "8px", position: "relative" },
  navLabel: { fontSize: "12px", fontWeight: "500" },
  emptyState: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center" },
  modal: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", zIndex: 50 },
  modalContent: { backgroundColor: "#2a2f2e", borderRadius: "16px", padding: "24px", maxWidth: "384px", width: "100%", border: "1px solid #3a3f3e" },
  toast: { position: "absolute", bottom: "80px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#5170ff", color: "#ffffff", padding: "12px 24px", borderRadius: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.3)", zIndex: 50, animation: "bounce 1s ease-in-out" },

  // Login/Register specific small overrides
  authContainer: { display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#1c2120" },
  authCard: { maxWidth: "420px", margin: "56px auto", borderRadius: "12px", overflow: "hidden", border: "1px solid #3a3f3e" },
  authHeader: { backgroundColor: "#5170ff", padding: "24px", textAlign: "center" },
  authHeaderTitle: { color: "#fff", fontSize: "28px", fontWeight: "700", margin: 0 },
  authBody: { background: "#2a2f2e", padding: "20px" },
  authInput: { width: "100%", padding: "12px", borderRadius: "8px", border: "none", outline: "none", marginBottom: "12px", background: "rgba(255,255,255,0.03)", color: "#fff" },
  linkButton: { background: "none", border: "none", color: "#5170ff", cursor: "pointer", fontWeight: 700, textDecoration: "underline" },
};






// --- App Component ---
const App = () => {
  // Auth & global app states
  const [currentScreen, setCurrentScreen] = useState("login"); // 'login' | 'register' | 'app'
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userInfo, setUserInfo] = useState(null);

  // Login form
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  // Register form
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "", phoneNumber: "", role: "user" });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Parqueo RD local states (from second code)
  const [activeTab, setActiveTab] = useState("mapa");
  const [reservas, setReservas] = useState([
    { id: 1, lugar: "Plaza Central", fecha: "15 Nov 2025", hora: "14:00 - 18:00", espacio: "A-25", estado: "activa" },
    { id: 2, lugar: "Sambil", fecha: "20 Nov 2025", hora: "10:00 - 13:00", espacio: "B-12", estado: "activa" },
  ]);
  const [notificaciones, setNotificaciones] = useState([
    { id: 1, titulo: "Reserva Confirmada", mensaje: "Tu reserva en Plaza Central ha sido confirmada", tiempo: "Hace 5 min", leida: false },
    { id: 2, titulo: "Recordatorio", mensaje: "Tu reserva comienza en 30 minutos", tiempo: "Hace 1 hora", leida: false },
    { id: 3, titulo: "Pago Procesado", mensaje: "Se ha procesado tu pago de RD$150", tiempo: "Hace 2 horas", leida: true },
  ]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [reservaToCancel, setReservaToCancel] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Parqueos (mock)
  const parqueos = [
    { id: 1, nombre: "Plaza Central", disponibles: 12 },
    { id: 2, nombre: "Sambil", disponibles: 8 },
    { id: 3, nombre: "Ágora Mall", disponibles: 15 },
    { id: 4, nombre: "Blue Mall", disponibles: 5 },
  ];

  // load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchUserInfo(storedToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch /auth/me
  const fetchUserInfo = async (authToken) => {
    try {
      const resp = await fetch(`${BASE_URL}/api/auth/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" },
      });
      if (resp.ok) {
        const json = await resp.json();
        setUserInfo(json.user || { name: json.name, email: json.email }); // fallback
        setCurrentScreen("app");
      } else {
        // invalid token
        localStorage.removeItem("token");
        setToken("");
        setUserInfo(null);
        setCurrentScreen("login");
      }
    } catch (err) {
      console.error("fetchUserInfo error:", err);
      localStorage.removeItem("token");
      setToken("");
      setUserInfo(null);
      setCurrentScreen("login");
    }
  };

  // login handler
  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      setError("Por favor completa todos los campos");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const resp = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginData.email, password: loginData.password }),
      });
      const data = await resp.json();
      if (resp.ok) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        await fetchUserInfo(data.token);
        setError("");
      } else {
        setError(data.message || "Credenciales inválidas");
      }
    } catch (err) {
      console.error("login error:", err);
      setError("Error de conexión. Por favor intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // register handler
  const handleRegister = async () => {
    if (!registerData.name || !registerData.email || !registerData.password || !registerData.phoneNumber) {
      setError("Por favor completa todos los campos");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const resp = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
          phoneNumber: registerData.phoneNumber,
          role: registerData.role,
        }),
      });
      const data = await resp.json();
      if (resp.ok) {
        // After successful registration, ask user to login
        alert("Registro exitoso. Por favor inicia sesión.");
        setCurrentScreen("login");
        setRegisterData({ name: "", email: "", password: "", phoneNumber: "", role: "user" });
        setError("");
      } else {
        setError(data.message || "Error en el registro");
      }
    } catch (err) {
      console.error("register error:", err);
      setError("Error de conexión. Por favor intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUserInfo(null);
    setCurrentScreen("login");
  };

  // Toast helper
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Reserva helpers from second code
  const cancelarReserva = (reserva) => {
    setReservaToCancel(reserva);
    setShowCancelModal(true);
  };
  const confirmarCancelacion = () => {
    setReservas(reservas.filter((r) => r.id !== reservaToCancel.id));
    setShowCancelModal(false);
    showToastMessage("Reserva cancelada exitosamente");
    setReservaToCancel(null);
  };
  const marcarTodasLeidas = () => {
    setNotificaciones(notificaciones.map((n) => ({ ...n, leida: true })));
    showToastMessage("Todas las notificaciones marcadas como leídas");
  };
  const reservarParqueo = (parqueo) => {
    const nuevaReserva = {
      id: reservas.length + 1,
      lugar: parqueo.nombre,
      fecha: "14 Nov 2025",
      hora: "15:00 - 19:00",
      espacio: `${String.fromCharCode(65 + Math.floor(Math.random() * 3))}-${Math.floor(Math.random() * 50) + 1}`,
      estado: "activa",
    };
    setReservas([...reservas, nuevaReserva]);
    showToastMessage(`Reserva creada en ${parqueo.nombre}`);
    setActiveTab("reservas");
  };

  // --- Screens: Login / Register (styled to match Parqueo RD) ---
  const LoginScreen = () => (
    <div style={styles.authContainer}>
      <div style={styles.authCard}>
        <div style={styles.authHeader}>
          <h1 style={styles.authHeaderTitle}>Parqueo RD</h1>
          <p style={{ color: "rgba(255,255,255,0.9)", marginTop: 6 }}>Inicia sesión para continuar</p>
        </div>
        <div style={styles.authBody}>
          {error && <div style={{ background: "#f87171", color: "#fff", padding: 10, borderRadius: 8, marginBottom: 10 }}>{error}</div>}
          <input
            style={styles.authInput}
            placeholder="Correo electrónico"
            type="email"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            disabled={loading}
          />
          <input
            style={styles.authInput}
            placeholder="Contraseña"
            type="password"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            disabled={loading}
          />
          <button
            style={{ ...styles.button, width: "100%", padding: 14, marginTop: 8, opacity: loading ? 0.6 : 1 }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Iniciando..." : "Iniciar sesión"}
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
            <button
              style={styles.linkButton}
              onClick={() => {
                setCurrentScreen("register");
                setError("");
              }}
              disabled={loading}
            >
              ¿No tienes cuenta? Regístrate
            </button>
            <button
              style={{ ...styles.linkButton, textDecoration: "none" }}
              onClick={() => {
                // quick demo login (optional)
                setLoginData({ email: "demo@demo.com", password: "password" });
              }}
            >
              Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const RegisterScreen = () => (
    <div style={styles.authContainer}>
      <div style={{ padding: 12 }}>
        <button
          onClick={() => {
            setCurrentScreen("login");
            setError("");
          }}
          style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}
          disabled={loading}
        >
          <ArrowLeft size={20} color="#fff" /> Volver
        </button>
      </div>

      <div style={styles.authCard}>
        <div style={styles.authHeader}>
          <h1 style={styles.authHeaderTitle}>Crea tu cuenta</h1>
        </div>
        <div style={styles.authBody}>
          {error && <div style={{ background: "#f87171", color: "#fff", padding: 10, borderRadius: 8, marginBottom: 10 }}>{error}</div>}
          <input
            style={styles.authInput}
            placeholder="Nombre completo"
            type="text"
            value={registerData.name}
            onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
            disabled={loading}
          />
          <input
            style={styles.authInput}
            placeholder="Correo electrónico"
            type="email"
            value={registerData.email}
            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
            disabled={loading}
          />
          <input
            style={styles.authInput}
            placeholder="Teléfono"
            type="tel"
            value={registerData.phoneNumber}
            onChange={(e) => setRegisterData({ ...registerData, phoneNumber: e.target.value })}
            disabled={loading}
          />
          <input
            style={styles.authInput}
            placeholder="Contraseña"
            type="password"
            value={registerData.password}
            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            disabled={loading}
          />
          <select
            value={registerData.role}
            onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
            style={{ ...styles.authInput, padding: 10, appearance: "none" }}
            disabled={loading}
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
            <option value="owner">Propietario</option>
          </select>

          <button
            style={{ ...styles.button, width: "100%", padding: 14, marginTop: 8, opacity: loading ? 0.6 : 1 }}
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Registrando..." : "Regístrate"}
          </button>
        </div>
      </div>
    </div>
  );

  // --- Main App (Parqueo RD) screens ---
  const MapaTab = () => (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={styles.searchBar}>
        <div style={styles.searchInput}>
          <Search size={20} color="#ffffff" />
          <input type="text" placeholder="Buscar ubicación..." style={styles.input} />
        </div>
      </div>
      <div style={styles.content}>
        {parqueos.map((parqueo) => (
          <div key={parqueo.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div style={styles.iconContainer}>
                  <MapPin size={24} color="#ffffff" />
                </div>
                <div>
                  <h3 style={styles.cardTitle}>{parqueo.nombre}</h3>
                  <p style={styles.cardSubtitle}>Santo Domingo</p>
                </div>
              </div>
              <span style={styles.badge}>{parqueo.disponibles} disponibles</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #3a3f3e" }}>
              <div style={{ fontSize: "14px", color: "#9ca3af" }}>
                <span style={{ fontWeight: "600", color: "#ffffff", fontSize: "16px" }}>RD$50</span>/hora
              </div>
              <button
                onClick={() => reservarParqueo(parqueo)}
                style={styles.button}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#4060ef")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#5170ff")}
              >
                Reservar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ReservasTab = () => (
    <div style={styles.content}>
      {reservas.length === 0 ? (
        <div style={styles.emptyState}>
          <Calendar size={80} color="#9ca3af" style={{ marginBottom: "16px" }} />
          <p style={{ fontSize: "18px", color: "#ffffff", marginBottom: "16px" }}>No tienes reservas activas</p>
          <button onClick={() => setActiveTab("mapa")} style={styles.button}>
            Reservar Espacio
          </button>
        </div>
      ) : (
        reservas.map((reserva) => (
          <div key={reserva.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={{ display: "flex", gap: "12px", flex: 1 }}>
                <div style={styles.iconContainer}>
                  <Car size={24} color="#ffffff" />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={styles.cardTitle}>{reserva.lugar}</h3>
                  <p style={styles.cardSubtitle}>
                    {reserva.fecha} - {reserva.hora}
                  </p>
                  <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>Espacio: {reserva.espacio}</p>
                </div>
              </div>
              <span style={{ ...styles.badge, fontSize: "12px" }}>{reserva.estado}</span>
            </div>

            <button
              onClick={() => cancelarReserva(reserva)}
              style={{
                width: "100%",
                marginTop: "12px",
                padding: "8px",
                borderRadius: "8px",
                fontWeight: "600",
                backgroundColor: "rgba(239, 68, 68, 0.2)",
                color: "#f87171",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                cursor: "pointer",
              }}
            >
              Cancelar Reserva
            </button>
          </div>
        ))
      )}
    </div>
  );

  const PerfilTab = () => {
    const usuario = userInfo
      ? {
          nombre: userInfo.name || userInfo.nombre || `${userInfo.firstName || ""} ${userInfo.lastName || ""}`.trim(),
          email: userInfo.email || userInfo.mail || "",
          telefono: userInfo.phoneNumber || userInfo.telefono || "1809XXXXXXX",
        }
      : { nombre: "Invitado", email: "guest@parqueord.com", telefono: "+1 (809) 555-1234" };

    return (
      <div style={{ height: "100%", overflow: "auto", backgroundColor: "#1c2120" }}>
        <div style={{ backgroundColor: "#5170ff", padding: "32px", textAlign: "center" }}>
          <div style={{ width: "96px", height: "96px", backgroundColor: "#ffffff", borderRadius: "50%", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={48} color="#5170ff" />
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#ffffff", margin: "0 0 8px 0" }}>{usuario.nombre}</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", margin: 0 }}>{usuario.email}</p>
        </div>

        <div style={{ padding: "16px" }}>
          <h3 style={{ fontSize: "12px", fontWeight: "600", color: "#9ca3af", marginBottom: "12px" }}>INFORMACIÓN PERSONAL</h3>
          <div style={styles.card}>
            <div style={{ padding: "16px", borderBottom: "1px solid #3a3f3e", display: "flex", alignItems: "center", gap: "12px" }}>
              <User size={20} color="#9ca3af" />
              <div>
                <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>Nombre</p>
                <p style={{ fontWeight: "500", color: "#ffffff", margin: 0 }}>{usuario.nombre}</p>
              </div>
            </div>

            <div style={{ padding: "16px", borderBottom: "1px solid #3a3f3e", display: "flex", alignItems: "center", gap: "12px" }}>
              <Bell size={20} color="#9ca3af" />
              <div>
                <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>Email</p>
                <p style={{ fontWeight: "500", color: "#ffffff", margin: 0 }}>{usuario.email}</p>
              </div>
            </div>

            <div style={{ padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
              <Settings size={20} color="#9ca3af" />
              <div>
                <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>Teléfono</p>
                <p style={{ fontWeight: "500", color: "#ffffff", margin: 0 }}>{usuario.telefono}</p>
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: "12px", fontWeight: "600", color: "#9ca3af", margin: "24px 0 12px" }}>CONFIGURACIÓN</h3>
          <div style={styles.card}>
            <button style={{ width: "100%", padding: "16px", display: "flex", alignItems: "center", gap: "12px", border: "none", background: "none", cursor: "pointer", borderBottom: "1px solid #3a3f3e" }}>
              <CreditCard size={20} color="#9ca3af" />
              <span style={{ flex: 1, textAlign: "left", fontWeight: "500", color: "#ffffff" }}>Métodos de Pago</span>
            </button>

            <button style={{ width: "100%", padding: "16px", display: "flex", alignItems: "center", gap: "12px", border: "none", background: "none", cursor: "pointer", borderBottom: "1px solid #3a3f3e" }}>
              <Settings size={20} color="#9ca3af" />
              <span style={{ flex: 1, textAlign: "left", fontWeight: "500", color: "#ffffff" }}>Configuración</span>
            </button>

            <button style={{ width: "100%", padding: "16px", display: "flex", alignItems: "center", gap: "12px", border: "none", background: "none", cursor: "pointer", borderBottom: "1px solid #3a3f3e" }}>
              <HelpCircle size={20} color="#9ca3af" />
              <span style={{ flex: 1, textAlign: "left", fontWeight: "500", color: "#ffffff" }}>Ayuda y Soporte</span>
            </button>

            <button
              onClick={handleLogout}
              style={{ width: "100%", padding: "16px", display: "flex", alignItems: "center", gap: "12px", border: "none", background: "none", cursor: "pointer" }}
            >
              <LogOut size={20} color="#f87171" />
              <span style={{ flex: 1, textAlign: "left", fontWeight: "500", color: "#f87171" }}>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const NotificacionesTab = () => (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#1c2120" }}>
      <div style={{ padding: "16px", backgroundColor: "#2a2f2e", borderBottom: "1px solid #3a3f3e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#ffffff", margin: 0 }}>Notificaciones</h2>
        <button onClick={marcarTodasLeidas} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px", fontWeight: "600", color: "#5170ff", border: "none", background: "none", cursor: "pointer" }}>
          <Check size={16} /> Marcar leídas
        </button>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "16px" }}>
        {notificaciones.map((notif) => (
          <div key={notif.id} style={{ ...styles.card, borderLeft: !notif.leida ? "4px solid #5170ff" : "1px solid #3a3f3e" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
              <h3 style={{ fontWeight: "bold", color: "#ffffff", margin: 0 }}>{notif.titulo}</h3>
              {!notif.leida && <span style={{ backgroundColor: "#5170ff", color: "#ffffff", padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap" }}>Nueva</span>}
            </div>
            <p style={{ fontSize: "14px", color: "#9ca3af", margin: "8px 0" }}>{notif.mensaje}</p>
            <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>{notif.tiempo}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // --- Compose main app or auth screens ---
  if (currentScreen === "login") {
    return <LoginScreen />;
  }
  if (currentScreen === "register") {
    return <RegisterScreen />;
  }

  // currentScreen === 'app' -> show main Parqueo RD UI
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Parqueo RD</h1>
        <p style={styles.headerSubtitle}>Reserva tu espacio fácilmente</p>
      </div>

      <div style={{ flex: 1, overflow: "hidden" }}>
        {activeTab === "mapa" && <MapaTab />}
        {activeTab === "reservas" && <ReservasTab />}
        {activeTab === "perfil" && <PerfilTab />}
        {activeTab === "notificaciones" && <NotificacionesTab />}
      </div>

      <div style={styles.bottomNav}>
        <button onClick={() => setActiveTab("mapa")} style={{ ...styles.navButton, color: activeTab === "mapa" ? "#5170ff" : "#9ca3af" }}>
          <MapPin size={24} />
          <span style={styles.navLabel}>Mapa</span>
        </button>

        <button onClick={() => setActiveTab("reservas")} style={{ ...styles.navButton, color: activeTab === "reservas" ? "#5170ff" : "#9ca3af" }}>
          <Calendar size={24} />
          <span style={styles.navLabel}>Reservas</span>
          {reservas.length > 0 && (
            <span style={{ position: "absolute", top: "4px", right: "25%", backgroundColor: "#5170ff", color: "#ffffff", fontSize: "12px", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
              {reservas.length}
            </span>
          )}
        </button>

        <button onClick={() => setActiveTab("perfil")} style={{ ...styles.navButton, color: activeTab === "perfil" ? "#5170ff" : "#9ca3af" }}>
          <User size={24} />
          <span style={styles.navLabel}>Perfil</span>
        </button>

        <button onClick={() => setActiveTab("notificaciones")} style={{ ...styles.navButton, color: activeTab === "notificaciones" ? "#5170ff" : "#9ca3af" }}>
          <Bell size={24} />
          <span style={styles.navLabel}>Notif.</span>
          {notificaciones.filter((n) => !n.leida).length > 0 && (
            <span style={{ position: "absolute", top: "4px", right: "25%", backgroundColor: "#5170ff", color: "#ffffff", fontSize: "12px", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
              {notificaciones.filter((n) => !n.leida).length}
            </span>
          )}
        </button>
      </div>

      {showCancelModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#ffffff", marginBottom: "8px" }}>Cancelar Reserva</h3>
            <p style={{ color: "#9ca3af", marginBottom: "24px" }}>¿Estás seguro de cancelar la reserva en {reservaToCancel?.lugar}?</p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setShowCancelModal(false)} style={{ flex: 1, padding: "12px", borderRadius: "8px", fontWeight: "600", backgroundColor: "#3a3f3e", color: "#ffffff", border: "none", cursor: "pointer" }}>
                No
              </button>
              <button onClick={confirmarCancelacion} style={{ flex: 1, padding: "12px", borderRadius: "8px", fontWeight: "600", backgroundColor: "#5170ff", color: "#ffffff", border: "none", cursor: "pointer" }}>
                Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showToast && <div style={styles.toast}>{toastMessage}</div>}
    </div>
  );
};

export default App;
