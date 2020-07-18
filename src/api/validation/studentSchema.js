const {object, string, number} = require('yup')
const {getGenders, getStudyPrograms} = require('../model/common')

async function studentSchema({type}) {
	const genders = await getGenders()
	const studyPrograms = await getStudyPrograms()
	const schema = type === 'edit' ? generateEditSchema(genders, studyPrograms) : generateSignupSchema(genders, studyPrograms)
	return schema
}

function generateSignupSchema(genders, studyPrograms) {
	const schema = object().shape({
		nim: number().required(),
		username: string().required(),
		password: string().min(8).required(),
		fullname: string().required(),
		address: string().required(),
		study: number()
			.oneOf(studyPrograms.map(({id}) => id))
			.required(),
		gender: number()
			.oneOf(genders.map(({id}) => id))
			.required(),
		semester: number().required(),
	})

	return schema
}

function generateEditSchema(genders, studyPrograms) {
	const schema = object().shape({
		nim: number().required(),
		username: string().required(),
		fullname: string().required(),
		address: string().required(),
		study: number()
			.oneOf(studyPrograms.map(({id}) => id))
			.required(),
		gender: number()
			.oneOf(genders.map(({id}) => id))
			.required(),
		semester: number().required(),
	})

	return schema
}

module.exports = studentSchema