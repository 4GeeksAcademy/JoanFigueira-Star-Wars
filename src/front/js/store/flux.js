const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			jobOffers: [],
			selectedJobOffer: null,
			token: null,
			user: null,
			proyectos: [],
			userPostulaciones: []
		},
		actions: {
			loadAllJobOffers: async () => {
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/ofertas`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
						}
					});

					if (resp.ok) {
						const data = await resp.json();
						setStore({ jobOffers: data.ofertas });
					} else {
						console.error("Error al cargar ofertas");
					}
				} catch (error) {
					console.error("Error en la solicitud de ofertas:", error);
				}
			},

			loadJobOfferById: async (id) => {
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/oferta/${id}`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
						}
					});

					if (resp.ok) {
						const data = await resp.json();
						setStore({ selectedJobOffer: data.oferta });
					} else {
						console.error("Error al cargar la oferta");
					}
				} catch (error) {
					console.error("Error en la solicitud de oferta:", error);
				}
			},
			createJobOffer: async (offerData) => {
				console.log(offerData);

				try {
					const token = localStorage.getItem('token');
					const resp = await fetch(`${process.env.BACKEND_URL}/api/crearOferta`, {
						method: 'POST',
						headers: {
							"Content-Type": 'application/json',
							Authorization: `Bearer ${token}`
						},
						body: JSON.stringify(offerData)
					});

					if (resp.ok) {
						const data = await resp.json();
						const store = getStore();
						setStore({ jobOffers: [...store.jobOffers, data.oferta] });
						return data;
					} else {
						const errorData = await resp.json();
						console.error("Error al crear la oferta:", errorData.msg);
						return errorData;
					}
				} catch (error) {
					console.error("Error al conectarse con el backend:", error);
				}
			},

			applyToJobOffer: async (oferta_id) =>{
				const store = getStore();
				const token = store.token;

				if(!token){
					return {msg: "Usuario no autenticado: registrate o inicia sesión", type: 'error'}
				}

				try{
					const resp = await fetch(`${process.env.BACKEND_URL}/api/postulados`, {
						method: 'POST',
						headers:{
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`
						},
						body: JSON.stringify({oferta_id})
					});

					if(resp.ok){
						const data = await resp.json();
						console.log('Inscripcion exitosa:', data)
						setStore({
							userPostulaciones: [...store.userPostulaciones, { user_id: store.user.id, oferta_id }]
						  });
						return {msg: "Inscripcion realizada con exito.", type: "success"};
					} else {
						const errorData = await resp.json();
						console.log("Error al inscribirse: ", errorData.msg);
						return  {msg: errorData.msg, type: 'warning'};
						
					}
				} catch (error){
					return {msg: "Error en la solicitud de inscripcion.", type: "error"}
				}
			},

			unapplyFromJobOffer: async (oferta_id) => {
				const store = getStore();
				const token = store.token;
			
				if (!token) {
					return { msg: "Usuario no autenticado: regístrate o inicia sesión", type: 'error' };
				}
			
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/postulados/${oferta_id}`, {
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`,
						},
					});
			
					if (resp.ok) {
						const data = await resp.json();
						console.log('Desinscripción exitosa', data);
						return { msg: "Desinscripción realizada con éxito.", type: "success" };
					} else {
						const errorData = await resp.json();
						console.log("Error al desinscribirse: ", errorData.msg);
						return { msg: errorData.msg, type: 'warning' };
					}
				} catch (error) {
					console.log("Error en la solicitud de desinscripción.");
					return { msg: "Error en la solicitud de desinscripción.", type: "error" };
				}
			},
			loadUserPostulaciones: async () => {
				const store = getStore();
				const token = store.token;
				if (!token) return;
			  
				try {
				  const response = await fetch(`${process.env.BACKEND_URL}/api/user/postulados`, {
					method: 'GET',
					headers: {
					  'Content-Type': 'application/json',
					  Authorization: `Bearer ${token}`,
					},
				  });
			  
				  if (response.ok) {
					const data = await response.json();
					setStore({ userPostulaciones: data.postulados });
					console.log('Postulaciones del usuario cargadas:', data.postulados);
				  } else {
					const errorData = await response.json();
					console.error('Error al cargar las postulaciones:', errorData.msg);
				  }
				} catch (error) {
				  console.error('Error al obtener postulaciones:', error);
				}
			  },
			  

			getNumeroPostulados: async (oferta_id) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/ofertas/${oferta_id}/postulados`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${getStore().token}`							},
					});
					if (response.ok) {
						const data = await response.json();
						return data.numero_postulados;
					} else {
						const errorData = await response.json();
						console.error('Error al obtener número de postulaciones:', errorData.msg);
						return null;
					}
				} catch (error) {
					console.error('Error en la solicitud:', error);
					return null;
				}
			},

			getMessage: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
					const data = await resp.json();
					setStore({ message: data.message });

					return data;
				} catch (error) {
					console.log("Error loading message from backend", error);
				}
			},
			register: async (formData) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/register", {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(formData),
					})
					const data = await resp.json()
					setStore(data)
					localStorage.setItem('token', data.token)
					return data

				} catch (error) {
					console.log('error:' + error)
				}
			},
			resetStore: () => {
				setStore({ msg: "", success: "" })
			},
			logOut: () => {
				localStorage.removeItem("token")
				setStore({ msg: "", token: "", success: "", user: "", empleador: "", programador: "" })
				return true
			},
			editUser: async (formData, texto, token) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + `/api/user/edit${texto}`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`
						},
						body: JSON.stringify(formData),
					})
					const data = await resp.json()
					setStore(data)
					localStorage.setItem('token', data.token)
					return data

				} catch (error) {
					console.log('error:' + error)
				}
			},
			logOut: () => {
				localStorage.removeItem("token")
				setStore({ msg: "", token: "", success: "", user: "", empleador: "", programador: "" })
				return true
			},
			login: async (credentials) => {
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/login`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(credentials)
					});

					if (resp.ok) {
						const data = await resp.json();
						localStorage.setItem('token', data.token);
						setStore({ token: data.token, user: data.user });
						await actions.loadUserPostulaciones(); //Cargamos las postulaciones del usuario al inciar sesión
						return data;
					} else {

						return false;
					}
				} catch (error) {
					console.error("Error al conectarse con el backend:", error);
				}
			},

			loadUserFromToken: () => {
				const token = localStorage.getItem('token');
				if (token) {
					setStore({ token: token });
				}
			},
			addProjects: async (formData, token) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/user/programador/addProjects", {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`
						},
						body: JSON.stringify(formData),
					})
					const data = await resp.json()
					setStore(
						{proyectos: [...getStore().proyectos, data.proyectos]})
					return data

				} catch (error) {
					console.log('error:' + error)
				}
			},

			resetPassword: async (token, password1, password2) => {
				if (!password1 || !password2) {
					console.log("Faltan campos");
					return false;
				}

				if (password1.trim() !== password2.trim()) {
					console.log("Las contraseñas no coinciden");
					return false;
				}

				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/reset-password`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({
							password: password1,
						}),
					});

					if (resp.ok) {
						const data = await resp.json();
						console.log("Contraseña cambiada exitosamente", data);
						return true;
					} else {
						const errorData = await resp.json();
						console.log("Error al cambiar contraseña:", errorData.message);
						return false;
					}
				} catch (error) {
					console.error("Error al cambiar contraseña:", error);
					return false;
				}
			},

		}
	};
};

export default getState;
