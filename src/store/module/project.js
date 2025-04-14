import { getBusinesslist, changeBusiness } from '@/api/cmdb';

export const project = {
	namespaced: true,
	state: {
		activeProject: '123',
		// 业务相关
		showBusiness: true,
		businessObj: {},
		theBusinessID: '',
		businessList: [],
		projectList: [
			{
				value: 'New York',
				label: 'New York'
			},
			{
				value: 'New York',
				label: 'New York'
			}
		]
	},
	mutations: {
		// 业务相关
		setBusinessObj(state, data) {
			state.businessObj = data;
		},
		setBusinessID(state, bizID) {
			state.theBusinessID = bizID;
		},
		setBusinessList(state, bizList) {
			state.businessList = bizList;
		},

		setProjectList(state, list) {
			state.projectList = list;
		},
		setProject(state, project) {
			state.activeProject = project;
		}
	},
	actions: {

		handlerSelectBusiness({ commit }, data) {
			return new Promise((resolve, reject) => {
				changeBusiness({ biz_id: data.value })
					.then((res) => {
						let resData = res.data;
						commit('setBusinessID', resData.biz_id);
						resolve(res);
					})
					.catch((err) => {
						reject(err);
					});
			});
		},
		async handlerGetBusinessList({ commit }) {
			const res = await getBusinesslist()
			if (res.data.length > 0) {
				commit('setBusinessList', res.data);
				commit('setBusinessID', res.data.cookie_biz_id);
			}
		},
	},
	getters: {
		businessList: (state) => {
			return state.businessList;
		},
	}
};

export default project;
