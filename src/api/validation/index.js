const {object, string, number} = require('yup')

const {getFakultas, getGenders, getProdi} = require('../model')

function fetchFakultas(callback) {
	return getFakultas((error, result) => {
		if (error) {
			console.log(error)
		}
		callback(result)
	})
}

function fetchProdi(callback) {
	return getProdi((error, result) => {
		if (error) {
			console.log(error)
		}
		callback(result)
	})
}

function fetchGender(callback) {
	getGenders((error, result) => {
		if (error) {
			console.log(error)
		}
		callback(result)
	})
}

function generateDosenSchema(genders, fakultas, callback) {
	const schema = object().shape({
		nip: number().required(),
		username: string().required(),
		password: string().min(8).required(),
		fullname: string().required(),
		alamat: string().required(),
		fakultas: number()
			.oneOf(fakultas.map(({id}) => id))
			.required(),
		gender: number()
			.oneOf(genders.map(({id}) => id))
			.required(),
	})

	callback(schema)
}

function generateMahasiswaSchema(genders, prodi, callback) {
	const schema = object().shape({
		nim: number().required(),
		username: string().required(),
		password: string().min(8).required(),
		fullname: string().required(),
		alamat: string().required(),
		prodi: number()
			.oneOf(prodi.map(({id}) => id))
			.required(),
		gender: number()
			.oneOf(genders.map(({id}) => id))
			.required(),
		semester: number().required(),
	})

	callback(schema)
}

function dosenSchema(callback) {
	fetchGender((gender) => {
		fetchFakultas((fakultas) => {
			generateDosenSchema(gender, fakultas, callback)
		})
	})
}

function mahasiswaSchema(callback) {
	fetchGender((gender) => {
		fetchProdi((prodi) => {
			generateMahasiswaSchema(gender, prodi, callback)
		})
	})
}

module.exports = {dosenSchema, mahasiswaSchema}
