// ! подкл Customizator 
import Customizator from "./customizator";

window.addEventListener('DOMContentLoaded',()=> {
	// при помощи дерективы new создаем новый Customizator
	const panel = new Customizator(); //! в panel лежит объект Customizator из файла customizator.js
	panel.render(); //! так мы выполним весь код который есть в render() из файла customizator.js
});