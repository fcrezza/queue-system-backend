const {object, string, number} = require('yup')
const {getFaculties, getGenders} = require('../model/common')

async function professorSchema({type}) {
	const genders = await getGenders()
	const faculties = await getFaculties()
	const schema =
		type === 'edit'
			? generateEditSchema(genders, faculties)
			: generateSignupSchema(genders, faculties)
	return schema
}

function generateSignupSchema(genders, faculties) {
	const schema = object().shape({
		nip: number().required(),
		username: string().required(),
		password: string().min(8).required(),
		fullname: string().required(),
		address: string().required(),
		faculty: number()
			.oneOf(faculties.map(({id}) => id))
			.required(),
		gender: number()
			.oneOf(genders.map(({id}) => id))
			.required(),
	})

	return schema
}

function generateEditSchema(genders, faculties) {
	const schema = object().shape({
		nip: number().required(),
		username: string().required(),
		fullname: string().required(),
		address: string().required(),
		faculty: number()
			.oneOf(faculties.map(({id}) => id))
			.required(),
		gender: number()
			.oneOf(genders.map(({id}) => id))
			.required(),
	})

	return schema
}

module.exports = professorSchema
