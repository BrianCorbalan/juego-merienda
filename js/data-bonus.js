/**
 * data-bonus.js
 * -------------
 * Pool GLOBAL de preguntas BONUS de cultura general. No pertenecen a
 * ninguna categoría. Se usan cuando un jugador cae en una categoría ya
 * completada (3/3 estrellas) o en la casilla ⭐ Especial.
 *
 * Cada entrada tiene { q: pregunta, a: respuesta }. La respuesta se
 * revela recién cuando el moderador toca "Ver respuesta" (ver cards.js /
 * ui.js), y ahí aparecen los botones Correcto / Incorrecto.
 *
 * Regla: una vez usada una pregunta en la partida, se saca del pool y no
 * vuelve a aparecer (ver state.js -> drawBonusQuestion).
 */

const BONUS_QUESTIONS = [
  // Mundo / Geografía
  { q: '¿Cuál es el país más grande del mundo por superficie?', a: 'Rusia' },
  { q: '¿Cuál es el río más largo del mundo?', a: 'El río Nilo (aunque algunos estudios lo disputan con el Amazonas)' },
  { q: '¿Cuál es el desierto más grande del mundo?', a: 'La Antártida (si se cuentan los desiertos fríos); el Sahara es el más grande cálido' },
  { q: '¿Cuántos países tiene América del Sur?', a: '12 países' },
  { q: '¿Cuál es la capital de Australia?', a: 'Canberra' },
  { q: '¿Cuál es el océano más grande del planeta?', a: 'El océano Pacífico' },
  { q: '¿Cuál es la montaña más alta del mundo?', a: 'El Everest' },
  { q: '¿En qué continente está Egipto?', a: 'África' },
  { q: '¿Cuál es el país más poblado del mundo?', a: 'India' },
  { q: '¿Cuál es la ciudad más poblada de Argentina?', a: 'Buenos Aires' },
  { q: '¿Qué país tiene forma de bota?', a: 'Italia' },
  { q: '¿Cuál es el lago más grande de Sudamérica?', a: 'El lago Titicaca (entre Perú y Bolivia)' },
  { q: '¿Cuántos husos horarios tiene Rusia?', a: '11 husos horarios' },
  { q: '¿Cuál es la moneda oficial de Japón?', a: 'El yen' },
  { q: '¿Qué país es conocido como "la tierra del sol naciente"?', a: 'Japón' },
  { q: '¿Cuál es el punto más bajo de la Tierra (sin contar el mar)?', a: 'El Mar Muerto' },
  { q: '¿Qué océano separa América de Europa?', a: 'El océano Atlántico' },
  { q: '¿Cuál es la isla más grande del mundo?', a: 'Groenlandia' },
  { q: '¿En qué país está Machu Picchu?', a: 'Perú' },
  { q: '¿Cuál es la cordillera más larga del mundo?', a: 'La cordillera de los Andes' },

  // Historia
  { q: '¿En qué año llegó el hombre a la Luna?', a: '1969' },
  { q: '¿Quién fue el primer presidente de Argentina?', a: 'Bernardino Rivadavia' },
  { q: '¿En qué año cayó el Muro de Berlín?', a: '1989' },
  { q: '¿Qué imperio construyó el Coliseo Romano?', a: 'El Imperio Romano' },
  { q: '¿En qué año comenzó la Segunda Guerra Mundial?', a: '1939' },
  { q: '¿Quién pintó la Capilla Sixtina?', a: 'Miguel Ángel' },
  { q: '¿Qué civilización construyó Machu Picchu?', a: 'Los incas' },
  { q: '¿En qué año se independizó Argentina?', a: '1816' },
  { q: '¿Quién fue Leonardo Da Vinci además de pintor?', a: 'Inventor, científico e ingeniero' },
  { q: '¿Qué barco famoso se hundió en 1912?', a: 'El Titanic' },
  { q: '¿Quién escribió el Martín Fierro?', a: 'José Hernández' },
  { q: '¿En qué siglo vivió Napoleón Bonaparte?', a: 'Entre los siglos XVIII y XIX (1769-1821)' },
  { q: '¿Qué antigua civilización construyó las pirámides de Guiza?', a: 'Los antiguos egipcios' },
  { q: '¿Quién fue Eva Perón?', a: 'Primera dama argentina, esposa de Juan Domingo Perón' },
  { q: '¿En qué año terminó la Segunda Guerra Mundial?', a: '1945' },

  // Tecnología
  { q: '¿Quién fundó Microsoft?', a: 'Bill Gates, junto a Paul Allen' },
  { q: '¿Qué significa la sigla "WWW"?', a: 'World Wide Web' },
  { q: '¿Qué empresa creó el iPhone?', a: 'Apple' },
  { q: '¿En qué año se creó Google?', a: '1998' },
  { q: '¿Qué significa "CPU"?', a: 'Unidad Central de Procesamiento (Central Processing Unit)' },
  { q: '¿Quién es considerado el padre de la computación?', a: 'Alan Turing' },
  { q: '¿Qué red social fue fundada por Mark Zuckerberg?', a: 'Facebook' },
  { q: '¿Qué significa la sigla "IA"?', a: 'Inteligencia Artificial' },
  { q: '¿Cuál fue el primer lenguaje de programación ampliamente usado?', a: 'Fortran' },
  { q: '¿Qué compañía fabrica los procesadores "Snapdragon"?', a: 'Qualcomm' },
  { q: '¿Qué significa "USB"?', a: 'Universal Serial Bus' },
  { q: '¿En qué año se lanzó el primer iPhone?', a: '2007' },

  // Música
  { q: '¿Quién compuso "Las Cuatro Estaciones"?', a: 'Antonio Vivaldi' },
  { q: '¿De qué país es originario el tango?', a: 'Argentina (región del Río de la Plata)' },
  { q: '¿Qué banda británica formaron John Lennon y Paul McCartney?', a: 'The Beatles' },
  { q: '¿Quién es conocido como el "Rey del Pop"?', a: 'Michael Jackson' },
  { q: '¿Qué instrumento tiene 88 teclas?', a: 'El piano' },
  { q: '¿Qué cantante argentino compuso "Matador"?', a: 'Fito Páez' },
  { q: '¿Cómo se llama la banda de Freddie Mercury?', a: 'Queen' },
  { q: '¿Qué género musical nació en Nueva Orleans?', a: 'El jazz' },
  { q: '¿Quién compuso el Himno Nacional Argentino?', a: 'Blas Parera (música); Vicente López y Planes (letra)' },
  { q: '¿Qué instrumento toca tradicionalmente un mariachi además de la trompeta?', a: 'La guitarra (o el guitarrón/violín)' },

  // Series
  { q: '¿En qué ciudad transcurre la serie "Friends"?', a: 'Nueva York' },
  { q: '¿Cómo se llama el protagonista de "Breaking Bad"?', a: 'Walter White' },
  { q: '¿En qué serie aparece la familia Targaryen?', a: 'Game of Thrones (Juego de Tronos)' },
  { q: '¿Qué serie sigue a un grupo de niños en el pueblo de Hawkins?', a: 'Stranger Things' },
  { q: '¿Cuál es el apellido de la familia protagonista de "The Simpsons"?', a: 'Simpson' },
  { q: '¿En qué país se ambienta la serie "La Casa de Papel"?', a: 'España' },
  { q: '¿Cómo se llama el café donde se reúnen los protagonistas de "Friends"?', a: 'Central Perk' },
  { q: '¿Qué serie médica se ambienta en el "Seattle Grace Hospital"?', a: 'Grey\'s Anatomy' },

  // Películas
  { q: '¿Quién dirigió la trilogía de "El Señor de los Anillos"?', a: 'Peter Jackson' },
  { q: '¿En qué película aparece el personaje "Woody"?', a: 'Toy Story' },
  { q: '¿Qué actor interpretó a Iron Man en el UCM?', a: 'Robert Downey Jr.' },
  { q: '¿Cuál es la película animada más taquillera de todos los tiempos (hasta hace poco)?', a: 'Frozen II' },
  { q: '¿Qué estudio produce las películas de "Shrek"?', a: 'DreamWorks' },
  { q: '¿Quién dirigió "Titanic"?', a: 'James Cameron' },
  { q: '¿En qué película un tiburón aterroriza un pueblo costero?', a: 'Tiburón (Jaws)' },
  { q: '¿Qué saga de películas incluye a "Darth Vader"?', a: 'Star Wars' },
  { q: '¿Qué actor interpretó al Joker en "The Dark Knight"?', a: 'Heath Ledger' },
  { q: '¿Cómo se llama el león protagonista de "El Rey León"?', a: 'Simba' },

  // Videojuegos
  { q: '¿Qué personaje es el mascota principal de Nintendo?', a: 'Mario' },
  { q: '¿En qué videojuego se recolectan "Estrellas de Poder"?', a: 'Super Mario 64' },
  { q: '¿Qué empresa creó "PlayStation"?', a: 'Sony' },
  { q: '¿Cómo se llama el protagonista de "The Legend of Zelda"?', a: 'Link' },
  { q: '¿Qué juego popularizó el género "battle royale" en 2017?', a: 'Fortnite (junto a PUBG)' },
  { q: '¿Qué personaje azul y veloz es la mascota de Sega?', a: 'Sonic' },
  { q: '¿En qué videojuego se construyen mundos con bloques cúbicos?', a: 'Minecraft' },
  { q: '¿Qué franquicia enfrenta a peleadores como Ryu y Ken?', a: 'Street Fighter' },
  { q: '¿Qué compañía creó "Pokémon"?', a: 'Game Freak, junto a Nintendo' },
  { q: '¿Cómo se llama el fontanero protagonista de los juegos de Nintendo?', a: 'Mario' },

  // Ciencia
  { q: '¿Cuál es el planeta más cercano al Sol?', a: 'Mercurio' },
  { q: '¿Cuántos huesos tiene el cuerpo humano adulto aproximadamente?', a: '206 huesos' },
  { q: '¿Qué gas respiramos principalmente para vivir?', a: 'Oxígeno' },
  { q: '¿Cuál es el órgano más grande del cuerpo humano?', a: 'La piel' },
  { q: '¿Qué científico formuló la teoría de la relatividad?', a: 'Albert Einstein' },
  { q: '¿Cuál es la velocidad de la luz aproximada en el vacío?', a: 'Unos 300.000 km por segundo' },
  { q: '¿Qué planeta es conocido como "el planeta rojo"?', a: 'Marte' },
  { q: '¿Cuántos corazones tiene un pulpo?', a: '3 corazones' },
  { q: '¿Qué parte de la célula contiene el material genético?', a: 'El núcleo' },
  { q: '¿Qué científico propuso la teoría de la evolución?', a: 'Charles Darwin' },
  { q: '¿Cuál es el elemento químico más abundante en el universo?', a: 'El hidrógeno' },
  { q: '¿Cuántos planetas tiene el sistema solar?', a: '8 planetas' },

  // Curiosidades
  { q: '¿Cuántos minutos tiene un día completo?', a: '1440 minutos' },
  { q: '¿Cuál es el animal terrestre más rápido del mundo?', a: 'El guepardo' },
  { q: '¿Cuál es el hueso más largo del cuerpo humano?', a: 'El fémur' },
  { q: '¿Cuántas patas tiene una araña?', a: '8 patas' },
  { q: '¿Cuál es el mamífero más grande del mundo?', a: 'La ballena azul' },
  { q: '¿Cuántos colores tiene el arcoíris?', a: '7 colores' },
  { q: '¿Cuál es el metal líquido a temperatura ambiente?', a: 'El mercurio' },
  { q: '¿Cuántos dientes tiene un adulto humano aproximadamente?', a: '32 dientes' },
  { q: '¿Cuál es el ave que no puede volar más conocida?', a: 'El avestruz' },
  { q: '¿Cuántas cuerdas tiene una guitarra clásica?', a: '6 cuerdas' },

  // Deportes
  { q: '¿Cada cuántos años se celebran los Juegos Olímpicos?', a: 'Cada 4 años' },
  { q: '¿Cuántos jugadores tiene un equipo de fútbol en la cancha?', a: '11 jugadores' },
  { q: '¿En qué país nació el rugby?', a: 'Inglaterra' },
  { q: '¿Cuántos sets se necesitan para ganar un partido de tenis a 5 sets?', a: '3 sets' },
  { q: '¿Qué selección ganó el Mundial de fútbol 2022?', a: 'Argentina' },
  { q: '¿Cuántos aros tiene el símbolo olímpico?', a: '5 aros' },
  { q: '¿En qué deporte se usa un "birdie" o volante?', a: 'El bádminton' },
  { q: '¿Cuántos jugadores tiene un equipo de básquet en cancha?', a: '5 jugadores' },
  { q: '¿Cuál es el maratón de distancia oficial en kilómetros aproximados?', a: 'Aproximadamente 42 km (42,195 km)' },
  { q: '¿En qué ciudad se jugó el Mundial de fútbol de 1978?', a: 'Buenos Aires' },

  // Arte
  { q: '¿Quién pintó "La noche estrellada"?', a: 'Vincent van Gogh' },
  { q: '¿Quién pintó "Guernica"?', a: 'Pablo Picasso' },
  { q: '¿Qué pintor argentino es conocido por retratar escenas sociales como en su obra "Manifestación"?', a: 'Antonio Berni' },
  { q: '¿En qué museo se exhibe la Mona Lisa?', a: 'El Museo del Louvre, en París' },
  { q: '¿Qué movimiento artístico fundó Salvador Dalí junto a otros?', a: 'El surrealismo' },
  { q: '¿Qué pintor se cortó una oreja?', a: 'Vincent van Gogh' },
  { q: '¿Qué técnica pictórica usa pequeños puntos de color?', a: 'El puntillismo' },

  // Comida
  { q: '¿De qué país es originaria la pizza margarita?', a: 'Italia' },
  { q: '¿Qué ingrediente principal lleva el guacamole?', a: 'La palta (aguacate)' },
  { q: '¿De qué país es típico el sushi?', a: 'Japón' },
  { q: '¿Qué carne se usa tradicionalmente en un asado argentino además de vacuna?', a: 'Cerdo, pollo o chorizo' },
  { q: '¿Qué fruta es la principal del "smoothie" clásico de banana?', a: 'La banana' },
  { q: '¿Qué país es famoso por el fondue de queso?', a: 'Suiza' },
  { q: '¿Qué bebida se prepara tradicionalmente con yerba y agua caliente en Argentina?', a: 'El mate' },
  { q: '¿Qué especia se obtiene del estigma de una flor y es la más cara del mundo?', a: 'El azafrán' },
  { q: '¿Qué país inventó los fideos según se cree tradicionalmente?', a: 'China' },
  { q: '¿Qué fruta tropical tiene forma de estrella al cortarla?', a: 'La carambola (fruta estrella)' },

  // Animales
  { q: '¿Cuál es el animal más grande del mundo?', a: 'La ballena azul' },
  { q: '¿Qué animal es conocido como "el rey de la selva"?', a: 'El león' },
  { q: '¿Cuántos corazones tiene una lombriz de tierra aproximadamente?', a: '5 pares de arcos aórticos (se suele decir "5 corazones")' },
  { q: '¿Qué animal cambia de color para camuflarse?', a: 'El camaleón' },
  { q: '¿Cuál es el ave más grande que no vuela?', a: 'El avestruz' },
  { q: '¿Qué animal duerme boca abajo colgado de los árboles?', a: 'El murciélago' },
  { q: '¿Cuál es el mamífero marino más grande?', a: 'La ballena azul' },
  { q: '¿Qué animal tiene el cuello más largo?', a: 'La jirafa' },
  { q: '¿Qué insecto produce miel?', a: 'La abeja' },
  { q: '¿Cuántas patas tiene un insecto?', a: '6 patas' },
  { q: '¿Qué animal es el símbolo de Australia junto al koala?', a: 'El canguro' },
  { q: '¿Qué ave migratoria es conocida por volar en formación de "V"?', a: 'Los gansos' },

  // Extra mixtas
  { q: '¿Cuántos días tiene un año bisiesto?', a: '366 días' },
  { q: '¿Cuál es el idioma más hablado del mundo como lengua materna?', a: 'El chino mandarín' },
  { q: '¿Qué país tiene la Torre Eiffel?', a: 'Francia' },
  { q: '¿Cuántas letras tiene el abecedario español (con la ñ)?', a: '27 letras' },
  { q: '¿Qué instrumento se usa para medir la temperatura?', a: 'El termómetro' },
  { q: '¿Cuál es la capital de Brasil?', a: 'Brasilia' },
  { q: '¿Qué país tiene forma de dragón según algunos, en el sudeste asiático?', a: 'Vietnam' },
  { q: '¿Cuál es el signo del zodíaco representado por un cangrejo?', a: 'Cáncer' },
  { q: '¿Qué figura geométrica tiene 3 lados?', a: 'El triángulo' },
  { q: '¿Cuántos meses del año tienen 31 días?', a: '7 meses' },
  { q: '¿Qué planeta tiene los famosos anillos más visibles?', a: 'Saturno' },
  { q: '¿Cuál es la capital de Argentina?', a: 'Buenos Aires' },
  { q: '¿Cuántas cuerdas vocales tiene el ser humano?', a: '2 cuerdas vocales' },
  { q: '¿Qué órgano bombea la sangre en el cuerpo humano?', a: 'El corazón' },
  { q: '¿Cuál es el punto cardinal opuesto al norte?', a: 'El sur' }
];
