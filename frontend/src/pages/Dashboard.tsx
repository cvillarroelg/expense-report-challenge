import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </header>

      <main style={styles.main}>
        <section style={styles.card}>
          <h3>Bienvenido 👋</h3>
          <p>Has iniciado sesión correctamente.</p>
        </section>

        <section style={styles.card}>
          <h3>Información general</h3>
          <ul>
            <li>Estado: Activo</li>
            <li>Rol: Usuario</li>
            <li>Último acceso: Hoy</li>
          </ul>
        </section>

        <section style={styles.card}>
          <h3>Acciones rápidas</h3>
          <button>Ver perfil</button>
          <button style={{ marginLeft: "10px" }}>Configuración</button>
        </section>
      </main>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  main: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "15px",
  },
};

export default Dashboard;
