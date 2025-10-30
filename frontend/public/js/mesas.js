function initModuloMesas() {
  console.log("🧩 Módulo Mesas iniciado.");

  // ================================
  //  Referencias a elementos
  // ================================
  const tablaMesas = document.getElementById('tablaMesas');
  const formAgregarMesa = document.getElementById('formAgregarMesa');
  const msgMesas = document.getElementById('msgMesas');
  const msgCrearMesa = document.getElementById('msgCrearMesa');
  const inputMesaIdEditar = document.getElementById('mesaIdEditar');
  const btnCrearActualizar = document.getElementById('btnCrearActualizar');
  const inputNumero = document.getElementById('nuevoNumero');
  const inputCapacidad = document.getElementById('nuevaCapacidad');
  const selectEstado = document.getElementById('nuevoEstado');
  const inputUbicacion = document.getElementById('nuevaUbicacion');

  if (!tablaMesas || !formAgregarMesa) {
    console.warn("⚠️ Elementos del módulo Mesas no encontrados.");
    return;
  }

  // ================================
  //  🔹 Cargar mesas
  // ================================
  async function cargarMesas() {
    msgMesas.textContent = '';
    tablaMesas.innerHTML = '<tr><td colspan="6" class="text-center">Cargando...</td></tr>';

    try {
      const res = await fetch('http://localhost:4000/api/mesas', { credentials: 'include' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const mesas = await res.json();

      if (!mesas.length) {
        tablaMesas.innerHTML = '<tr><td colspan="6" class="text-center">No hay mesas registradas</td></tr>';
        return;
      }

      tablaMesas.innerHTML = mesas.map(mesa => `
        <tr>
          <td>${mesa.numero}</td>
          <td>${mesa.capacidad}</td>
          <td>
            <select onchange="actualizarEstadoMesa('${mesa._id}', this.value)" class="form-select form-select-sm">
              <option value="Libre" ${mesa.estado === 'Libre' ? 'selected' : ''}>Libre</option>
              <option value="Ocupada" ${mesa.estado === 'Ocupada' ? 'selected' : ''}>Ocupada</option>
              <option value="Reservada" ${mesa.estado === 'Reservada' ? 'selected' : ''}>Reservada</option>
              <option value="Pendiente de pago" ${mesa.estado === 'Pendiente de pago' ? 'selected' : ''}>Pendiente de pago</option>
              <option value="Cerrada" ${mesa.estado === 'Cerrada' ? 'selected' : ''}>Cerrada</option>
            </select>
          </td>
          <td>${mesa.ubicacion || ''}</td>
          <td>${mesa.updatedAt ? new Date(mesa.updatedAt).toLocaleString() : ''}</td>
          <td>
            <button class="btn btn-editar btn-sm" onclick="editarMesa('${mesa._id}', '${mesa.capacidad}', '${mesa.ubicacion || ''}')">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn btn-eliminar btn-sm ms-1" onclick="eliminarMesa('${mesa._id}')">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>
      `).join('');

    } catch (err) {
      console.error(err);
      msgMesas.textContent = 'Error de conexión o la API no responde';
      msgMesas.className = 'msg text-danger text-center';
      tablaMesas.innerHTML = '';
    }
  }

  // ================================
  //  🔹 Actualizar estado de mesa
  // ================================
  window.actualizarEstadoMesa = async (id, estado) => {
    msgMesas.textContent = '';
    try {
      const res = await fetch(`http://localhost:4000/api/mesas/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ estado })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error actualizando estado');

      msgMesas.textContent = 'Estado actualizado';
      msgMesas.className = 'msg text-success text-center';

      const fila = document.querySelector(`button[onclick*="${id}"]`)?.closest('tr');
      if (fila) {
        fila.classList.add('fila-actualizada');
        setTimeout(() => fila.classList.remove('fila-actualizada'), 1200);
      }

      cargarMesas();

    } catch (err) {
      console.error(err);
      msgMesas.textContent = err.message || 'Error de conexión';
      msgMesas.className = 'msg text-danger text-center';
    }
  };

  // ================================
  //  🔹 Editar mesa
  // ================================
  window.editarMesa = (id, capacidad, ubicacion) => {
    inputMesaIdEditar.value = id;
    inputCapacidad.value = capacidad;
    inputUbicacion.value = ubicacion;

    inputNumero.disabled = true;
    selectEstado.disabled = true;

    btnCrearActualizar.textContent = 'Actualizar';
    msgCrearMesa.textContent = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ================================
  //  🔹 Eliminar mesa
  // ================================
  window.eliminarMesa = async (id) => {
    if (!confirm('¿Deseas eliminar esta mesa?')) return;

    try {
      const res = await fetch(`http://localhost:4000/api/mesas/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error eliminando mesa');

      msgMesas.textContent = 'Mesa eliminada';
      msgMesas.className = 'msg text-success text-center';
      cargarMesas();

    } catch (err) {
      console.error(err);
      msgMesas.textContent = err.message || 'Error de conexión';
      msgMesas.className = 'msg text-danger text-center';
    }
  };

  // ================================
  //  🔹 Crear o actualizar mesa
  // ================================
  formAgregarMesa.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = inputMesaIdEditar.value.trim();
    const numero = parseInt(inputNumero.value.trim(), 10);
    const capacidad = parseInt(inputCapacidad.value.trim(), 10);
    const ubicacion = inputUbicacion.value.trim();

    if (isNaN(capacidad) || capacidad < 1) {
      msgCrearMesa.textContent = 'Capacidad inválida';
      msgCrearMesa.className = 'msg text-danger text-center';
      return;
    }

    try {
      let res, data;

      if (id) {
        res = await fetch(`http://localhost:4000/api/mesas/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ capacidad, ubicacion })
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error actualizando mesa');
        msgCrearMesa.textContent = 'Mesa actualizada correctamente';
      } else {
        const estado = selectEstado.value;
        if (isNaN(numero) || numero < 1) {
          msgCrearMesa.textContent = 'Número de mesa inválido';
          msgCrearMesa.className = 'msg text-danger text-center';
          return;
        }

        res = await fetch('http://localhost:4000/api/mesas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ numero, capacidad, estado, ubicacion })
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error creando mesa');
        msgCrearMesa.textContent = 'Mesa creada correctamente';
      }

      msgCrearMesa.className = 'msg text-success text-center';
      formAgregarMesa.reset();
      inputMesaIdEditar.value = '';
      inputNumero.disabled = false;
      selectEstado.disabled = false;
      btnCrearActualizar.textContent = 'Crear';
      cargarMesas();

    } catch (err) {
      console.error(err);
      msgCrearMesa.textContent = err.message || 'Error de conexión';
      msgCrearMesa.className = 'msg text-danger text-center';
    }
  });

  // ================================
  //  🔹 Carga inicial
  // ================================
  cargarMesas();
}
