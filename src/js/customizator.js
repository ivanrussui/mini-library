// экспортируем по умолчанию класс
export default class Customizator {
	constructor() { // конструктор
		// ! this чтобы в каждый отдельный экземпляр нашего объекта  сохранялись определенные свойства
		this.btnBlock = document.createElement('div');
		this.colorPicker = document.createElement('input');

		//! элемент чтобы юзер смог сбросить настройки
		this.clear = document.createElement('div');

		//! получаем из localStorage масштаб и цвет, || пишем чтобы было значение по умолчанию 
		this.scale = localStorage.getItem('scale') || 1;
		this.color = localStorage.getItem('color') || '#ffffff';

		// вешаем обработчик('при клике', (объект событие) => метод onScaleChange(объект событие))
		this.btnBlock.addEventListener('click', (e) => this.onScaleChange(e));
		this.colorPicker.addEventListener('input', (e) => this.onColorChange(e));

		// при клике на клеар запускается метод резет()
		this.clear.addEventListener('click', () => this.reset());
	}

	// создаем метод onScaleChange(объект событие)
	onScaleChange(e) {
		const body = document.querySelector('body'); // получ доступ к всем элементам на стр
		if (e) { //! (объект событие)
			// тут по сути мы получаем '1x' и '1.5x' чтобы привести к числу ставим + перед e
			this.scale = +e.target.value.replace(/x/g, ''); // регулярное выражение метод replace(/x - символ который хотим заменить/g - глобальность то есть все символы x которые попадаются,'' - на что хочу заменить)
		}

		// пишем рекурсию. рекурсия это когда функ вызывает сама себя
		const recursy = (element) => {
			// element.все дочерние элементы.forEach(каждый отдельный элемент => {
			element.childNodes.forEach(node => {
				//*(проверяем на текст и на не пустые узлы)           (s+ это пробелы)
				if (node.nodeName === '#text' && node.nodeValue.replace(/\s+/g, '').length > 0) {

					if (!node.parentNode.getAttribute('data-fz')) { // если атрибута 'data-fz' не существует
						//* получаем размер шрифта.  
						let value = window.getComputedStyle(node.parentNode, null).fontSize; // getComputedStyle() позволяет получить все стили кот были применены к элементу

						//* нода.ее родитель.добавитьАтрибут('data-fz', тут value к числу и регулярн выраж убирающее px)
						node.parentNode.setAttribute('data-fz', +value.replace(/px/g, ''));

						//! нода.ее родитель.стили.фонтСайз = нода.ее родитель.получитьАтрибут('data-fz') * масштаб + пиксели
						node.parentNode.style.fontSize = node.parentNode.getAttribute('data-fz') * this.scale + 'px';
					} else {
						//! нода.ее родитель.стили.фонтСайз = нода.ее родитель.получитьАтрибут('data-fz') * масштаб + пиксели
						node.parentNode.style.fontSize = node.parentNode.getAttribute('data-fz') * this.scale + 'px';
					}
				} else { // если условие не выполн. то мы запускаем функ еще раз 
					recursy(node); // node - каждый отдельный элемент внутри массива element.childNodes
				}
			});
		};

		recursy(body);

		// записылваем this.scale в локалстораж
		localStorage.setItem('scale', this.scale);

	}


	onColorChange(e) {
		const body = document.querySelector('body');
		body.style.backgroundColor = e.target.value; // = объект событие.элемент на котором возникло событие.его value
		localStorage.setItem('color', e.target.value); // записываем в локальное хранилище
	}

	//! метод устанавливающий бэкграунд-колор для тега бади когда только заходим на страницу, когда рендерится панелька
	setBgColor() {
		const body = document.querySelector('body');
		body.style.backgroundColor = this.color;
		this.colorPicker.value = this.color;
	}

	//! метод чтобы стилистические правила могли подключ. к той стр. на которой будет работать наш скрипт
	injectStyle() {
		const style = document.createElement('style');
		style.innerHTML = `
			.panel {
				display: flex;
				justify-content: space-around;
				align-items: center;
				position: fixed;
				top: 10px;
				right: 0;
				border: 1px solid rgba(0,0,0, .2);
				box-shadow: 0 0 20px rgba(0,0,0, .5);
				width: 300px;
				height: 60px;
				background-color: #fff;
				}
	
			.scale {
					display: flex;
					justify-content: space-around;
					align-items: center;
					width: 100px;
					height: 40px;
			}

			.scale_btn {
				display: block;
				width: 40px;
				height: 40px;
				border: 1px solid rgba(0,0,0, .2);
				border-radius: 4px;
				font-size: 18px;
		}
	
			.color {
					width: 40px;
					height: 40px;
			}

			.clear {
				font-size: 20px;
				cursor: pointer;
			}
		`;
		// вставляем верстку которая выше в тег head 
		document.querySelector('head').appendChild(style);
	}

	//! метод будет сбрасывать все к дефолтным настройкам 
	reset() {
		localStorage.clear();
		this.scale = 1;
		this.color = '#ffffff';
		this.setBgColor(); // вызываем метод с бэкграундКолор
		this.onScaleChange(); 
	}

	render() { // метод render
		this.injectStyle(); // вызываем метод с стилями
		this.setBgColor(); // вызываем метод с бэкграундКолор
		this.onScaleChange();
		
		// создаем элеметны чтобы разместить их на стр
		let scaleInputS = document.createElement('input'),
			scaleInputM = document.createElement('input'),
			panel = document.createElement('div');

		//! append вставляет эл-ты внутрь родительского элемента, в конец
		panel.append(this.btnBlock, this.colorPicker, this.clear); //! panel называется так же как и в файле main.js но это разные переменные
		this.clear.innerHTML = '&times';
		this.clear.classList.add('clear');

		scaleInputS.classList.add('scale_btn'); // добавляем класс
		scaleInputM.classList.add('scale_btn');
		this.btnBlock.classList.add('scale');
		this.colorPicker.classList.add('color');

		//! меняем type у инпутов
		scaleInputS.setAttribute('type', 'button'); // устанавливаем атрибут через setAttribute. getAttribute получает атрибут
		scaleInputM.setAttribute('type', 'button');
		scaleInputS.setAttribute('value', '1x'); // в value пишем 1х. потом это будет масштаб
		scaleInputM.setAttribute('value', '1.5x');
		this.colorPicker.setAttribute('type', 'color'); // тип атрибута color
		this.colorPicker.setAttribute('value', '#ffffff'); // устанавливаем цвет по умолчанию у  value. нельзя писать цвет #fff

		this.btnBlock.append(scaleInputS, scaleInputM); // вставляем в this.btnBlock   scaleInputS  и scaleInputM

		panel.classList.add('panel'); // доб класс

		//! помещаем все что выше на стр
		document.querySelector('body').append(panel); // получаем элемент куда будем вставлять, то что рендерим и вставляем

	}
}