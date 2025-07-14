/**
 * JavaScript para la gestión de trabajadores
 * Incluye funciones para CRUD, modales y validaciones
 */

// Variable global para almacenar el ID del trabajador a eliminar
let trabajadorIdEliminar = null;

/**
 * Inicializa los eventos y configuraciones cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar tooltips de Bootstrap
    inicializarTooltips();

    // Configurar eventos del filtro
    configurarFiltros();

    // Configurar eventos de botones
    configurarEventosBotones();
});

/**
 * Inicializa los tooltips de Bootstrap
 */
function inicializarTooltips() {
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

/**
 * Configura los eventos de los filtros
 */
function configurarFiltros() {
    const sexoSelect = document.getElementById('sexo');
    if (sexoSelect) {
        sexoSelect.addEventListener('change', function () {
            this.form.submit();
        });
    }
}

/**
 * Configura eventos adicionales para botones
 */
function configurarEventosBotones() {
    const actionButtons = document.querySelectorAll('.action-buttons .btn');
    actionButtons.forEach(button => {
        button.addEventListener('focus', function () {
            this.style.zIndex = '1';
        });
        button.addEventListener('blur', function () {
            this.style.zIndex = '';
        });
    });
}

/**
 * Abre el modal para crear un nuevo trabajador
 */
function abrirModalCrear() {
    const modalContent = document.getElementById('modalContent');
    if (!modalContent) {
        console.error('Modal content no encontrado');
        return;
    }

    // Limpiar contenido previo
    modalContent.innerHTML = '';

    // Mostrar loading
    modalContent.innerHTML = `
        <div class="text-center p-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2 text-muted">Cargando formulario...</p>
        </div>`;

    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('trabajadorModal'));
    modal.show();

    // Cargar contenido del modal
    fetch('/Trabajadores/Create')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            modalContent.innerHTML = html;
            // Reinicializar validación si jQuery está disponible
            if (typeof jQuery !== 'undefined' && jQuery.validator) {
                jQuery.validator.unobtrusive.parse('#createForm');
            }
        })
        .catch(error => {
            console.error('Error al cargar formulario de creación:', error);
            modalContent.innerHTML = `
                <div class="alert alert-danger m-3">
                    <i class="fas fa-exclamation-triangle"></i> 
                    Error al cargar el formulario. Por favor, intente nuevamente.
                </div>`;
        });
}

/**
 * Abre el modal para editar un trabajador
 * @param {number} id - ID del trabajador a editar
 */
function editarTrabajador(id) {
    if (!id) {
        console.error('ID de trabajador no válido');
        return;
    }

    const modalContent = document.getElementById('modalContent');
    if (!modalContent) {
        console.error('Modal content no encontrado');
        return;
    }

    // Limpiar contenido previo
    modalContent.innerHTML = '';

    // Mostrar loading
    modalContent.innerHTML = `
        <div class="text-center p-4">
            <div class="spinner-border text-warning" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2 text-muted">Cargando datos del trabajador...</p>
        </div>`;

    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('trabajadorModal'));
    modal.show();

    // Cargar contenido del modal
    fetch(`/Trabajadores/Edit/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            modalContent.innerHTML = html;
            // Reinicializar validación si jQuery está disponible
            if (typeof jQuery !== 'undefined' && jQuery.validator) {
                jQuery.validator.unobtrusive.parse('#editForm');
            }
        })
        .catch(error => {
            console.error('Error al cargar formulario de edición:', error);
            modalContent.innerHTML = `
                <div class="alert alert-danger m-3">
                    <i class="fas fa-exclamation-triangle"></i> 
                    Error al cargar el formulario de edición. Por favor, intente nuevamente.
                </div>`;
        });
}

/**
 * Muestra el modal de confirmación para eliminar un trabajador
 * @param {number} id - ID del trabajador a eliminar
 * @param {string} nombre - Nombre del trabajador a eliminar
 */
function confirmarEliminar(id, nombre) {
    if (!id || !nombre) {
        console.error('Parámetros inválidos para eliminar trabajador');
        return;
    }

    trabajadorIdEliminar = id;

    const trabajadorNombreElement = document.getElementById('trabajadorNombre');
    if (trabajadorNombreElement) {
        trabajadorNombreElement.textContent = nombre;
    }

    const deleteModalElement = document.getElementById('deleteModal');
    if (deleteModalElement) {
        const deleteModal = new bootstrap.Modal(deleteModalElement);
        deleteModal.show();
    }
}

/**
 * Elimina un trabajador después de la confirmación
 */
function eliminarTrabajador() {
    if (!trabajadorIdEliminar) {
        console.error('No hay trabajador seleccionado para eliminar');
        return;
    }

    // Mostrar loading en el botón
    const deleteButton = document.querySelector('#deleteModal .btn-danger');
    if (!deleteButton) {
        console.error('Botón de eliminar no encontrado');
        return;
    }

    const originalText = deleteButton.innerHTML;
    deleteButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Eliminando...';
    deleteButton.disabled = true;

    // Obtener el token antiforgery
    const token = document.querySelector('input[name="__RequestVerificationToken"]')?.value;

    fetch(`/Trabajadores/Delete/${trabajadorIdEliminar}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'RequestVerificationToken': token || ''
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Cerrar modal
                const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
                if (deleteModal) {
                    deleteModal.hide();
                }

                // Mostrar mensaje de éxito
                mostrarMensajeExito(data.message || 'Trabajador eliminado exitosamente');

                // Recargar página después de un breve delay
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                mostrarMensajeError(data.message || 'Error al eliminar el trabajador');
            }
        })
        .catch(error => {
            console.error('Error al eliminar trabajador:', error);
            mostrarMensajeError('Error al eliminar el trabajador. Por favor, intente nuevamente.');
        })
        .finally(() => {
            // Restaurar botón
            deleteButton.innerHTML = originalText;
            deleteButton.disabled = false;
            trabajadorIdEliminar = null;
        });
}

/**
 * Maneja el envío de formularios (crear/editar)
 * @param {Event} event - Evento del formulario
 * @param {HTMLFormElement} form - Formulario a enviar
 */
function submitForm(event, form) {
    event.preventDefault();

    if (!form) {
        console.error('Formulario no válido');
        return false;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    if (!submitButton) {
        console.error('Botón de envío no encontrado');
        return false;
    }

    const originalText = submitButton.innerHTML;

    // Mostrar loading
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...';
    submitButton.disabled = true;

    const formData = new FormData(form);

    fetch(form.action, {
        method: 'POST',
        body: formData
    })
        .then(response => {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            } else {
                return response.text();
            }
        })
        .then(data => {
            if (typeof data === 'object' && data.success) {
                // Éxito - cerrar modal y recargar
                const modal = bootstrap.Modal.getInstance(document.getElementById('trabajadorModal'));
                if (modal) {
                    modal.hide();
                }

                mostrarMensajeExito(data.message || 'Operación realizada exitosamente');

                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else if (typeof data === 'string') {
                // Error de validación - actualizar contenido del modal
                const modalContent = document.getElementById('modalContent');
                if (modalContent) {
                    modalContent.innerHTML = data;

                    // Reinicializar validación
                    if (typeof jQuery !== 'undefined' && jQuery.validator) {
                        const formId = form.id;
                        jQuery.validator.unobtrusive.parse(`#${formId}`);
                    }
                }
            } else {
                mostrarMensajeError(data.message || 'Error al procesar la solicitud');
            }
        })
        .catch(error => {
            console.error('Error al enviar formulario:', error);
            mostrarMensajeError('Error al procesar la solicitud. Por favor, intente nuevamente.');
        })
        .finally(() => {
            // Restaurar botón
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        });

    return false;
}

/**
 * Carga las provincias según el departamento seleccionado (para modo edición)
 * @param {number} departamentoId - ID del departamento
 * @param {number} provinciaSeleccionada - ID de la provincia a preseleccionar
 * @param {number} distritoSeleccionado - ID del distrito a preseleccionar
 */
function cargarProvinciasEdit(departamentoId, provinciaSeleccionada = 0, distritoSeleccionado = 0) {
    const provinciaSelect = document.querySelector('select[name="IdProvincia"]');
    const distritoSelect = document.querySelector('select[name="IdDistrito"]');

    if (!provinciaSelect) {
        console.error('Select de provincia no encontrado');
        return;
    }

    // Limpiar selects
    provinciaSelect.innerHTML = '<option value="">Seleccione...</option>';
    if (distritoSelect) {
        distritoSelect.innerHTML = '<option value="">Seleccione...</option>';
    }

    if (!departamentoId) return;

    // Mostrar loading
    provinciaSelect.innerHTML = '<option value="">Cargando provincias...</option>';
    provinciaSelect.disabled = true;

    fetch(`/Trabajadores/GetProvincias?departamentoId=${departamentoId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            provinciaSelect.innerHTML = '<option value="">Seleccione...</option>';

            if (Array.isArray(data)) {
                data.forEach(provincia => {
                    const option = document.createElement('option');
                    option.value = provincia.id;
                    option.textContent = provincia.nombreProvincia;

                    // Preseleccionar la provincia si coincide
                    if (provincia.id == provinciaSeleccionada) {
                        option.selected = true;
                    }

                    provinciaSelect.appendChild(option);
                });

                // Si hay una provincia seleccionada, cargar sus distritos
                if (provinciaSeleccionada > 0) {
                    cargarDistritosEdit(provinciaSeleccionada, distritoSeleccionado);
                }
            }
        })
        .catch(error => {
            console.error('Error al cargar provincias:', error);
            provinciaSelect.innerHTML = '<option value="">Error al cargar provincias</option>';
        })
        .finally(() => {
            provinciaSelect.disabled = false;
        });
}

/**
 * Carga los distritos según la provincia seleccionada (para modo edición)
 * @param {number} provinciaId - ID de la provincia
 * @param {number} distritoSeleccionado - ID del distrito a preseleccionar
 */
function cargarDistritosEdit(provinciaId, distritoSeleccionado = 0) {
    const distritoSelect = document.querySelector('select[name="IdDistrito"]');

    if (!distritoSelect) {
        console.error('Select de distrito no encontrado');
        return;
    }

    // Limpiar select
    distritoSelect.innerHTML = '<option value="">Seleccione...</option>';

    if (!provinciaId) return;

    // Mostrar loading
    distritoSelect.innerHTML = '<option value="">Cargando distritos...</option>';
    distritoSelect.disabled = true;

    fetch(`/Trabajadores/GetDistritos?provinciaId=${provinciaId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            distritoSelect.innerHTML = '<option value="">Seleccione...</option>';

            if (Array.isArray(data)) {
                data.forEach(distrito => {
                    const option = document.createElement('option');
                    option.value = distrito.id;
                    option.textContent = distrito.nombreDistrito;

                    // Preseleccionar el distrito si coincide
                    if (distrito.id == distritoSeleccionado) {
                        option.selected = true;
                    }

                    distritoSelect.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('Error al cargar distritos:', error);
            distritoSelect.innerHTML = '<option value="">Error al cargar distritos</option>';
        })
        .finally(() => {
            distritoSelect.disabled = false;
        });
}

/**
 * Carga las provincias según el departamento seleccionado (para modo creación)
 * @param {number} departamentoId - ID del departamento
 */
function cargarProvincias(departamentoId) {
    const provinciaSelect = document.querySelector('select[name="IdProvincia"]');
    const distritoSelect = document.querySelector('select[name="IdDistrito"]');

    if (!provinciaSelect) {
        console.error('Select de provincia no encontrado');
        return;
    }

    // Limpiar selects
    provinciaSelect.innerHTML = '<option value="">Seleccione...</option>';
    if (distritoSelect) {
        distritoSelect.innerHTML = '<option value="">Seleccione...</option>';
    }

    if (!departamentoId) return;

    // Mostrar loading
    provinciaSelect.innerHTML = '<option value="">Cargando provincias...</option>';
    provinciaSelect.disabled = true;

    fetch(`/Trabajadores/GetProvincias?departamentoId=${departamentoId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            provinciaSelect.innerHTML = '<option value="">Seleccione...</option>';

            if (Array.isArray(data)) {
                data.forEach(provincia => {
                    const option = document.createElement('option');
                    option.value = provincia.id;
                    option.textContent = provincia.nombreProvincia;
                    provinciaSelect.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('Error al cargar provincias:', error);
            provinciaSelect.innerHTML = '<option value="">Error al cargar provincias</option>';
        })
        .finally(() => {
            provinciaSelect.disabled = false;
        });
}

/**
 * Carga los distritos según la provincia seleccionada (para modo creación)
 * @param {number} provinciaId - ID de la provincia
 */
function cargarDistritos(provinciaId) {
    const distritoSelect = document.querySelector('select[name="IdDistrito"]');

    if (!distritoSelect) {
        console.error('Select de distrito no encontrado');
        return;
    }

    // Limpiar select
    distritoSelect.innerHTML = '<option value="">Seleccione...</option>';

    if (!provinciaId) return;

    // Mostrar loading
    distritoSelect.innerHTML = '<option value="">Cargando distritos...</option>';
    distritoSelect.disabled = true;

    fetch(`/Trabajadores/GetDistritos?provinciaId=${provinciaId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            distritoSelect.innerHTML = '<option value="">Seleccione...</option>';

            if (Array.isArray(data)) {
                data.forEach(distrito => {
                    const option = document.createElement('option');
                    option.value = distrito.id;
                    option.textContent = distrito.nombreDistrito;
                    distritoSelect.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('Error al cargar distritos:', error);
            distritoSelect.innerHTML = '<option value="">Error al cargar distritos</option>';
        })
        .finally(() => {
            distritoSelect.disabled = false;
        });
}

/**
 * Limpiar filtros de búsqueda
 */
function limpiarFiltros() {
    const form = document.querySelector('form[method="get"]');
    if (form) {
        const sexoSelect = document.getElementById('sexo');
        if (sexoSelect) {
            sexoSelect.value = '';
        }
        window.location.href = form.getAttribute('action') || window.location.pathname;
    }
}

/**
 * Muestra mensajes de éxito utilizando SweetAlert2 o fallback
 * @param {string} message - Mensaje a mostrar
 */
function mostrarMensajeExito(message) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: message,
            timer: 3000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end',
            timerProgressBar: true
        });
    } else {
        // Fallback si no hay SweetAlert2
        alert('Éxito: ' + message);
    }
}

/**
 * Muestra mensajes de error utilizando SweetAlert2 o fallback
 * @param {string} message - Mensaje a mostrar
 */
function mostrarMensajeError(message) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#dc3545'
        });
    } else {
        // Fallback si no hay SweetAlert2
        alert('Error: ' + message);
    }
}

/**
 * Función auxiliar para debounce (evitar múltiples llamadas)
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @param {boolean} immediate - Si ejecutar inmediatamente
 */
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}