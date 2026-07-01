/**
 * data-bonus.js
 * -------------
 * Pool GLOBAL de preguntas BONUS de cultura general. No pertenecen a
 * ninguna categoría. Se usan cuando un jugador cae en una categoría ya
 * completada (3/3 estrellas) o en la casilla ⭐ Especial.
 *
 * Regla: una vez usada una pregunta en la partida, se saca del pool y no
 * vuelve a aparecer (ver game.js -> drawBonusQuestion).
 */

const BONUS_QUESTIONS = [
  // Mundo / Geografía
  '¿Cuál es el país más grande del mundo por superficie?',
  '¿Cuál es el río más largo del mundo?',
  '¿Cuál es el desierto más grande del mundo?',
  '¿Cuántos países tiene América del Sur?',
  '¿Cuál es la capital de Australia?',
  '¿Cuál es el océano más grande del planeta?',
  '¿Cuál es la montaña más alta del mundo?',
  '¿En qué continente está Egipto?',
  '¿Cuál es el país más poblado del mundo?',
  '¿Cuál es la ciudad más poblada de Argentina?',
  '¿Qué país tiene forma de bota?',
  '¿Cuál es el lago más grande de Sudamérica?',
  '¿Cuántos husos horarios tiene Rusia?',
  '¿Cuál es la moneda oficial de Japón?',
  '¿Qué país es conocido como "la tierra del sol naciente"?',
  '¿Cuál es el punto más bajo de la Tierra (sin contar el mar)?',
  '¿Qué océano separa América de Europa?',
  '¿Cuál es la isla más grande del mundo?',
  '¿En qué país está Machu Picchu?',
  '¿Cuál es la cordillera más larga del mundo?',

  // Historia
  '¿En qué año llegó el hombre a la Luna?',
  '¿Quién fue el primer presidente de Argentina?',
  '¿En qué año cayó el Muro de Berlín?',
  '¿Qué imperio construyó el Coliseo Romano?',
  '¿En qué año comenzó la Segunda Guerra Mundial?',
  '¿Quién pintó la Capilla Sixtina?',
  '¿Qué civilización construyó Machu Picchu?',
  '¿En qué año se independizó Argentina?',
  '¿Quién fue Leonardo Da Vinci además de pintor?',
  '¿Qué barco famoso se hundió en 1912?',
  '¿Quién escribió el Martín Fierro?',
  '¿En qué siglo vivió Napoleón Bonaparte?',
  '¿Qué antigua civilización construyó las pirámides de Guiza?',
  '¿Quién fue Eva Perón?',
  '¿En qué año terminó la Segunda Guerra Mundial?',

  // Tecnología
  '¿Quién fundó Microsoft?',
  '¿Qué significa la sigla "WWW"?',
  '¿Qué empresa creó el iPhone?',
  '¿En qué año se creó Google?',
  '¿Qué significa "CPU"?',
  '¿Quién es considerado el padre de la computación?',
  '¿Qué red social fue fundada por Mark Zuckerberg?',
  '¿Qué significa la sigla "IA"?',
  '¿Cuál fue el primer lenguaje de programación ampliamente usado?',
  '¿Qué compañía fabrica los procesadores "Snapdragon"?',
  '¿Qué significa "USB"?',
  '¿En qué año se lanzó el primer iPhone?',

  // Música
  '¿Quién compuso "Las Cuatro Estaciones"?',
  '¿De qué país es originario el tango?',
  '¿Qué banda británica formaron John Lennon y Paul McCartney?',
  '¿Quién es conocido como el "Rey del Pop"?',
  '¿Qué instrumento tiene 88 teclas?',
  '¿Qué cantante argentino compuso "Matador"?',
  '¿Cómo se llama la banda de Freddie Mercury?',
  '¿Qué género musical nació en Nueva Orleans?',
  '¿Quién compuso el Himno Nacional Argentino?',
  '¿Qué instrumento toca tradicionalmente un mariachi además de la trompeta?',

  // Series
  '¿En qué ciudad transcurre la serie "Friends"?',
  '¿Cómo se llama el protagonista de "Breaking Bad"?',
  '¿En qué serie aparece la familia Targaryen?',
  '¿Qué serie sigue a un grupo de niños en el pueblo de Hawkins?',
  '¿Cuál es el apellido de la familia protagonista de "The Simpsons"?',
  '¿En qué país se ambienta la serie "La Casa de Papel"?',
  '¿Cómo se llama el café donde se reúnen los protagonistas de "Friends"?',
  '¿Qué serie médica se ambienta en el "Seattle Grace Hospital"?',

  // Películas
  '¿Quién dirigió la trilogía de "El Señor de los Anillos"?',
  '¿En qué película aparece el personaje "Woody"?',
  '¿Qué actor interpretó a Iron Man en el UCM?',
  '¿Cuál es la película animada más taquillera de todos los tiempos (hasta hace poco)?',
  '¿Qué estudio produce las películas de "Shrek"?',
  '¿Quién dirigió "Titanic"?',
  '¿En qué película un tiburón aterroriza un pueblo costero?',
  '¿Qué saga de películas incluye a "Darth Vader"?',
  '¿Qué actor interpretó al Joker en "The Dark Knight"?',
  '¿Cómo se llama el león protagonista de "El Rey León"?',

  // Videojuegos
  '¿Qué personaje es el mascota principal de Nintendo?',
  '¿En qué videojuego se recolectan "Estrellas de Poder"?',
  '¿Qué empresa creó "PlayStation"?',
  '¿Cómo se llama el protagonista de "The Legend of Zelda"?',
  '¿Qué juego popularizó el género "battle royale" en 2017?',
  '¿Qué personaje azul y veloz es la mascota de Sega?',
  '¿En qué videojuego se construyen mundos con bloques cúbicos?',
  '¿Qué franquicia enfrenta a peleadores como Ryu y Ken?',
  '¿Qué compañía creó "Pokémon"?',
  '¿Cómo se llama el fontanero protagonista de los juegos de Nintendo?',

  // Ciencia
  '¿Cuál es el planeta más cercano al Sol?',
  '¿Cuántos huesos tiene el cuerpo humano adulto aproximadamente?',
  '¿Qué gas respiramos principalmente para vivir?',
  '¿Cuál es el órgano más grande del cuerpo humano?',
  '¿Qué científico formuló la teoría de la relatividad?',
  '¿Cuál es la velocidad de la luz aproximada en el vacío?',
  '¿Qué planeta es conocido como "el planeta rojo"?',
  '¿Cuántos corazones tiene un pulpo?',
  '¿Qué parte de la célula contiene el material genético?',
  '¿Qué científico propuso la teoría de la evolución?',
  '¿Cuál es el elemento químico más abundante en el universo?',
  '¿Cuántos planetas tiene el sistema solar?',

  // Curiosidades
  '¿Cuántos minutos tiene un día completo?',
  '¿Cuál es el animal terrestre más rápido del mundo?',
  '¿Cuál es el hueso más largo del cuerpo humano?',
  '¿Cuántas patas tiene una araña?',
  '¿Cuál es el mamífero más grande del mundo?',
  '¿Cuántos colores tiene el arcoíris?',
  '¿Cuál es el metal líquido a temperatura ambiente?',
  '¿Cuántos dientes tiene un adulto humano aproximadamente?',
  '¿Cuál es el ave que no puede volar más conocida?',
  '¿Cuántas cuerdas tiene una guitarra clásica?',

  // Deportes
  '¿Cada cuántos años se celebran los Juegos Olímpicos?',
  '¿Cuántos jugadores tiene un equipo de fútbol en la cancha?',
  '¿En qué país nació el rugby?',
  '¿Cuántos sets se necesitan para ganar un partido de tenis a 5 sets?',
  '¿Qué selección ganó el Mundial de fútbol 2022?',
  '¿Cuántos aros tiene el símbolo olímpico?',
  '¿En qué deporte se usa un "birdie" o volante?',
  '¿Cuántos jugadores tiene un equipo de básquet en cancha?',
  '¿Cuál es el maratón de distancia oficial en kilómetros aproximados?',
  '¿En qué ciudad se jugó el Mundial de fútbol de 1978?',

  // Arte
  '¿Quién pintó "La noche estrellada"?',
  '¿Quién pintó "Guernica"?',
  '¿Qué pintor argentino es conocido por sus obras costumbristas como "El Almuerzo en la Hierba"? (pista: no es él, pensalo bien)',
  '¿En qué museo se exhibe la Mona Lisa?',
  '¿Qué movimiento artístico fundó Salvador Dalí junto a otros?',
  '¿Qué pintor se cortó una oreja?',
  '¿Qué técnica pictórica usa pequeños puntos de color?',

  // Comida
  '¿De qué país es originaria la pizza margarita?',
  '¿Qué ingrediente principal lleva el guacamole?',
  '¿De qué país es típico el sushi?',
  '¿Qué carne se usa tradicionalmente en un asado argentino además de vacuna?',
  '¿Qué fruta es la principal del "smoothie" clásico de banana?',
  '¿Qué país es famoso por el fondue de queso?',
  '¿Qué bebida se prepara tradicionalmente con yerba y agua caliente en Argentina?',
  '¿Qué especia se obtiene del estigma de una flor y es la más cara del mundo?',
  '¿Qué país inventó los fideos según se cree tradicionalmente?',
  '¿Qué fruta tropical tiene forma de estrella al cortarla?',

  // Animales
  '¿Cuál es el animal más grande del mundo?',
  '¿Qué animal es conocido como "el rey de la selva"?',
  '¿Cuántos corazones tiene una lombriz de tierra aproximadamente?',
  '¿Qué animal cambia de color para camuflarse?',
  '¿Cuál es el ave más grande que no vuela?',
  '¿Qué animal duerme boca abajo colgado de los árboles?',
  '¿Cuál es el mamífero marino más grande?',
  '¿Qué animal tiene el cuello más largo?',
  '¿Qué insecto produce miel?',
  '¿Cuántas patas tiene un insecto?',
  '¿Qué animal es el símbolo de Australia junto al koala?',
  '¿Qué ave migratoria es conocida por volar en formación de "V"?',

  // Extra mixtas
  '¿Cuántos días tiene un año bisiesto?',
  '¿Cuál es el idioma más hablado del mundo como lengua materna?',
  '¿Qué país tiene la Torre Eiffel?',
  '¿Cuántas letras tiene el abecedario español (con la ñ)?',
  '¿Qué instrumento se usa para medir la temperatura?',
  '¿Cuál es la capital de Brasil?',
  '¿Qué país tiene forma de dragón según algunos, en el sudeste asiático?',
  '¿Cuál es el signo del zodíaco representado por un cangrejo?',
  '¿Qué figura geométrica tiene 3 lados?',
  '¿Cuántos meses del año tienen 31 días?',
  '¿Qué planeta tiene los famosos anillos más visibles?',
  '¿Cuál es la capital de Argentina?',
  '¿Cuántas cuerdas vocales tiene el ser humano?',
  '¿Qué órgano bombea la sangre en el cuerpo humano?',
  '¿Cuál es el punto cardinal opuesto al norte?'
];
