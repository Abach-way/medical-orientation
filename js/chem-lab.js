/* ============================================
   CHEMISTRY LABORATORY — GAME ENGINE v3
   Realistic colors, 65+ reactions, XP/levels/achievements
   ============================================ */
(function() {
'use strict';

const SUBSTANCES = {
    H:{id:'H',symbol:'H',name:'Водород',cat:'nonmetal',num:1,color:'#e8e8ff',rc:'бесцветный газ'},
    He:{id:'He',symbol:'He',name:'Гелий',cat:'noble',num:2,color:'#ffe4f0',rc:'бесцветный газ'},
    Li:{id:'Li',symbol:'Li',name:'Литий',cat:'alkali',num:3,color:'#c0c0c0',rc:'серебристый мягкий'},
    C:{id:'C',symbol:'C',name:'Углерод',cat:'nonmetal',num:6,color:'#2d2d2d',rc:'чёрный (графит)'},
    N:{id:'N',symbol:'N',name:'Азот',cat:'nonmetal',num:7,color:'#d4e8ff',rc:'бесцветный газ'},
    O:{id:'O',symbol:'O',name:'Кислород',cat:'nonmetal',num:8,color:'#a8d8ff',rc:'бесцветный газ'},
    F:{id:'F',symbol:'F',name:'Фтор',cat:'halogen',num:9,color:'#e8ffa0',rc:'бледно-жёлтый газ'},
    Na:{id:'Na',symbol:'Na',name:'Натрий',cat:'alkali',num:11,color:'#e8e0d0',rc:'серебристо-белый'},
    Mg:{id:'Mg',symbol:'Mg',name:'Магний',cat:'alkaline',num:12,color:'#d0d0d0',rc:'серебристо-белый'},
    Al:{id:'Al',symbol:'Al',name:'Алюминий',cat:'metal',num:13,color:'#c8d0d8',rc:'серебристый'},
    Si:{id:'Si',symbol:'Si',name:'Кремний',cat:'nonmetal',num:14,color:'#4a5568',rc:'тёмно-серый'},
    P:{id:'P',symbol:'P',name:'Фосфор',cat:'nonmetal',num:15,color:'#fffde8',rc:'белый восковой'},
    S:{id:'S',symbol:'S',name:'Сера',cat:'nonmetal',num:16,color:'#ffd700',rc:'жёлтый порошок'},
    Cl:{id:'Cl',symbol:'Cl',name:'Хлор',cat:'halogen',num:17,color:'#b8e986',rc:'жёлто-зелёный газ'},
    K:{id:'K',symbol:'K',name:'Калий',cat:'alkali',num:19,color:'#d8d0c8',rc:'серебристо-белый'},
    Ca:{id:'Ca',symbol:'Ca',name:'Кальций',cat:'alkaline',num:20,color:'#f0ece0',rc:'серебристо-белый'},
    Ti:{id:'Ti',symbol:'Ti',name:'Титан',cat:'transition',num:22,color:'#b0b8c0',rc:'серебристый'},
    Cr:{id:'Cr',symbol:'Cr',name:'Хром',cat:'transition',num:24,color:'#a8b8c8',rc:'серебристый'},
    Mn:{id:'Mn',symbol:'Mn',name:'Марганец',cat:'transition',num:25,color:'#a0a0a0',rc:'серебристо-серый'},
    Fe:{id:'Fe',symbol:'Fe',name:'Железо',cat:'transition',num:26,color:'#8a8a8a',rc:'серебристо-серый'},
    Co:{id:'Co',symbol:'Co',name:'Кобальт',cat:'transition',num:27,color:'#7888a0',rc:'серебристо-голубоватый'},
    Ni:{id:'Ni',symbol:'Ni',name:'Никель',cat:'transition',num:28,color:'#a8a898',rc:'серебристо-белый'},
    Cu:{id:'Cu',symbol:'Cu',name:'Медь',cat:'transition',num:29,color:'#b87333',rc:'красно-оранжевый'},
    Zn:{id:'Zn',symbol:'Zn',name:'Цинк',cat:'transition',num:30,color:'#b8c0c8',rc:'голубовато-серый'},
    Br:{id:'Br',symbol:'Br',name:'Бром',cat:'halogen',num:35,color:'#8B0000',rc:'тёмно-красная жидкость'},
    Ag:{id:'Ag',symbol:'Ag',name:'Серебро',cat:'transition',num:47,color:'#e8e8e8',rc:'блестящий серебристый'},
    Sn:{id:'Sn',symbol:'Sn',name:'Олово',cat:'transition',num:50,color:'#d0d0c8',rc:'серебристо-белый'},
    I:{id:'I',symbol:'I',name:'Йод',cat:'halogen',num:53,color:'#4a0080',rc:'тёмно-фиолетовый'},
    Ba:{id:'Ba',symbol:'Ba',name:'Барий',cat:'alkaline',num:56,color:'#c8c0b0',rc:'серебристо-белый'},
    W:{id:'W',symbol:'W',name:'Вольфрам',cat:'transition',num:74,color:'#808890',rc:'серо-стальной'},
    Pt:{id:'Pt',symbol:'Pt',name:'Платина',cat:'transition',num:78,color:'#d8d8d0',rc:'серебристо-белый'},
    Au:{id:'Au',symbol:'Au',name:'Золото',cat:'transition',num:79,color:'#FFD700',rc:'жёлтый блестящий'},
    Hg:{id:'Hg',symbol:'Hg',name:'Ртуть',cat:'transition',num:80,color:'#c0c0c8',rc:'серебристая жидкость'},
    Pb:{id:'Pb',symbol:'Pb',name:'Свинец',cat:'transition',num:82,color:'#6b6b78',rc:'голубовато-серый'},

    HCl:{id:'HCl',symbol:'HCl',name:'Соляная кислота',cat:'acid',color:'#e8e8e8',rc:'бесцветная жидкость'},
    H2SO4:{id:'H2SO4',symbol:'H₂SO₄',name:'Серная кислота',cat:'acid',color:'#f0f0e0',rc:'бесцветная маслянистая'},
    HNO3:{id:'HNO3',symbol:'HNO₃',name:'Азотная кислота',cat:'acid',color:'#fff8e0',rc:'бесц./желтоватая'},
    H3PO4:{id:'H3PO4',symbol:'H₃PO₄',name:'Фосфорная кислота',cat:'acid',color:'#f8f8f0',rc:'бесцветная'},
    CH3COOH:{id:'CH3COOH',symbol:'CH₃COOH',name:'Уксусная кислота',cat:'acid',color:'#f8f8f0',rc:'бесцветная, резкий запах'},
    HF:{id:'HF',symbol:'HF',name:'Плавиковая кислота',cat:'acid',color:'#f0f0f0',rc:'бесцветная'},
    H2CO3:{id:'H2CO3',symbol:'H₂CO₃',name:'Угольная кислота',cat:'acid',color:'#e8f0f8',rc:'бесцветная (газировка)'},
    HBr:{id:'HBr',symbol:'HBr',name:'Бромоводородная к-та',cat:'acid',color:'#f0e8e0',rc:'бесцветная'},
    HCN:{id:'HCN',symbol:'HCN',name:'Синильная кислота',cat:'acid',color:'#f8f0f0',rc:'бесцветная, миндаль'},
    H2S:{id:'H2S',symbol:'H₂S',name:'Сероводород',cat:'acid',color:'#f0f0d0',rc:'бесцветный газ, тухлый'},

    NaOH:{id:'NaOH',symbol:'NaOH',name:'Гидроксид натрия',cat:'base',color:'#ffffff',rc:'белые гранулы'},
    KOH:{id:'KOH',symbol:'KOH',name:'Гидроксид калия',cat:'base',color:'#ffffff',rc:'белые гранулы'},
    Ca_OH_2:{id:'Ca_OH_2',symbol:'Ca(OH)₂',name:'Гидроксид кальция',cat:'base',color:'#f8f8f0',rc:'белый порошок'},
    Ba_OH_2:{id:'Ba_OH_2',symbol:'Ba(OH)₂',name:'Гидроксид бария',cat:'base',color:'#f0f0f0',rc:'белые кристаллы'},
    NH4OH:{id:'NH4OH',symbol:'NH₄OH',name:'Гидроксид аммония',cat:'base',color:'#f0f8f0',rc:'бесцветный р-р'},

    NaCl:{id:'NaCl',symbol:'NaCl',name:'Хлорид натрия',cat:'salt',color:'#ffffff',rc:'белые кристаллы'},
    KCl:{id:'KCl',symbol:'KCl',name:'Хлорид калия',cat:'salt',color:'#ffffff',rc:'белые кристаллы'},
    CaCO3:{id:'CaCO3',symbol:'CaCO₃',name:'Карбонат кальция',cat:'salt',color:'#f8f8f0',rc:'белый (мрамор/мел)'},
    Na2CO3:{id:'Na2CO3',symbol:'Na₂CO₃',name:'Карбонат натрия',cat:'salt',color:'#ffffff',rc:'белый порошок'},
    NaHCO3:{id:'NaHCO3',symbol:'NaHCO₃',name:'Сода пищевая',cat:'salt',color:'#ffffff',rc:'белый порошок'},
    CuSO4:{id:'CuSO4',symbol:'CuSO₄',name:'Сульфат меди',cat:'salt',color:'#1E90FF',rc:'ярко-синие кристаллы'},
    FeCl3:{id:'FeCl3',symbol:'FeCl₃',name:'Хлорид железа(III)',cat:'salt',color:'#8B4513',rc:'тёмно-коричневый'},
    AgNO3:{id:'AgNO3',symbol:'AgNO₃',name:'Нитрат серебра',cat:'salt',color:'#f0f0f0',rc:'бесцветные кристаллы'},
    KMnO4:{id:'KMnO4',symbol:'KMnO₄',name:'Перманганат калия',cat:'salt',color:'#800080',rc:'тёмно-фиолетовый'},
    BaCl2:{id:'BaCl2',symbol:'BaCl₂',name:'Хлорид бария',cat:'salt',color:'#f0f0f0',rc:'белые кристаллы'},
    PbNO3_2:{id:'PbNO3_2',symbol:'Pb(NO₃)₂',name:'Нитрат свинца',cat:'salt',color:'#f0f0f0',rc:'белые кристаллы'},
    KI:{id:'KI',symbol:'KI',name:'Йодид калия',cat:'salt',color:'#f8f8f0',rc:'белые кристаллы'},
    FeSO4:{id:'FeSO4',symbol:'FeSO₄',name:'Сульфат железа(II)',cat:'salt',color:'#90EE90',rc:'бледно-зелёные крист.'},
    ZnSO4:{id:'ZnSO4',symbol:'ZnSO₄',name:'Сульфат цинка',cat:'salt',color:'#f0f0f0',rc:'бесцветные кристаллы'},
    CaCl2:{id:'CaCl2',symbol:'CaCl₂',name:'Хлорид кальция',cat:'salt',color:'#f0f0f0',rc:'белые гранулы'},
    Na2S:{id:'Na2S',symbol:'Na₂S',name:'Сульфид натрия',cat:'salt',color:'#f8f0e0',rc:'желтоватые кристаллы'},
    K2Cr2O7:{id:'K2Cr2O7',symbol:'K₂Cr₂O₇',name:'Дихромат калия',cat:'salt',color:'#FF4500',rc:'ярко-оранжевые крист.'},
    NH4Cl:{id:'NH4Cl',symbol:'NH₄Cl',name:'Хлорид аммония',cat:'salt',color:'#ffffff',rc:'белый порошок'},

    H2O:{id:'H2O',symbol:'H₂O',name:'Вода',cat:'oxide',color:'#4fc3f7',rc:'бесцветная жидкость'},
    CO2:{id:'CO2',symbol:'CO₂',name:'Углекислый газ',cat:'oxide',color:'#e0e8f0',rc:'бесцветный газ'},
    SO2:{id:'SO2',symbol:'SO₂',name:'Сернистый газ',cat:'oxide',color:'#e8e8d0',rc:'бесцветный, резкий'},
    NO2:{id:'NO2',symbol:'NO₂',name:'Диоксид азота',cat:'oxide',color:'#8B4513',rc:'бурый ядовитый газ'},
    CaO:{id:'CaO',symbol:'CaO',name:'Негашёная известь',cat:'oxide',color:'#f8f8f0',rc:'белые комки'},
    Na2O:{id:'Na2O',symbol:'Na₂O',name:'Оксид натрия',cat:'oxide',color:'#ffffff',rc:'белый порошок'},
    Fe2O3:{id:'Fe2O3',symbol:'Fe₂O₃',name:'Оксид железа(III)',cat:'oxide',color:'#8B0000',rc:'бурый (ржавчина)'},
    Al2O3:{id:'Al2O3',symbol:'Al₂O₃',name:'Оксид алюминия',cat:'oxide',color:'#f0f0f0',rc:'белый порошок'},
    MnO2:{id:'MnO2',symbol:'MnO₂',name:'Диоксид марганца',cat:'oxide',color:'#2d2d2d',rc:'чёрный порошок'},

    NH3:{id:'NH3',symbol:'NH₃',name:'Аммиак',cat:'compound',color:'#e0f0e0',rc:'бесцветный газ, резкий'},
    H2O2:{id:'H2O2',symbol:'H₂O₂',name:'Перекись водорода',cat:'compound',color:'#e8f0ff',rc:'бесцветная жидкость'},
    C2H5OH:{id:'C2H5OH',symbol:'C₂H₅OH',name:'Этанол',cat:'organic',color:'#f8f0e0',rc:'бесцветная жидкость'},
    CH3OH:{id:'CH3OH',symbol:'CH₃OH',name:'Метанол',cat:'organic',color:'#f0e8e0',rc:'бесцветная жидкость'},
    C6H12O6:{id:'C6H12O6',symbol:'C₆H₁₂O₆',name:'Глюкоза',cat:'organic',color:'#ffffff',rc:'белые кристаллы'},
    C3H8:{id:'C3H8',symbol:'C₃H₈',name:'Пропан',cat:'organic',color:'#e8e8f0',rc:'бесцветный газ'},
    C6H6:{id:'C6H6',symbol:'C₆H₆',name:'Бензол',cat:'organic',color:'#f0f0e0',rc:'бесцветная жидкость'},
    CH4:{id:'CH4',symbol:'CH₄',name:'Метан',cat:'organic',color:'#e8e8f0',rc:'бесцветный газ'},
    C2H2:{id:'C2H2',symbol:'C₂H₂',name:'Ацетилен',cat:'organic',color:'#f0f0e8',rc:'бесцветный газ'},

    phenol:{id:'phenol',symbol:'Фенолфт.',name:'Фенолфталеин',cat:'indicator',color:'#f0f0f0',rc:'бесцветный'},
    litmus:{id:'litmus',symbol:'Лакмус',name:'Лакмус',cat:'indicator',color:'#9370DB',rc:'фиолетовый'},
    methyl_o:{id:'methyl_o',symbol:'Мет.оранж',name:'Метилоранж',cat:'indicator',color:'#FFA500',rc:'оранжевый'}
};

const REACTIONS = [
    {r:['NaOH','HCl'],eq:'NaOH + HCl → NaCl + H₂O',name:'Нейтрализация',type:'exo',energy:'-57 кДж/моль',rc:'#e8e8f0',anim:'heat',desc:'Щёлочь + кислота → соль + вода. Раствор нагревается!',med:'Принцип антацидов (Маалокс).',cond:'t° комнатная',products:['NaCl','H₂O'],danger:0,xp:10},
    {r:['KOH','HCl'],eq:'KOH + HCl → KCl + H₂O',name:'KOH + HCl',type:'exo',energy:'-57 кДж/моль',rc:'#e8e8f0',anim:'heat',desc:'Нейтрализация — раствор прозрачный, нагревается.',med:'KCl — препарат при гипокалиемии.',cond:'t° комнатная',products:['KCl','H₂O'],danger:0,xp:10},
    {r:['NaOH','H2SO4'],eq:'2NaOH + H₂SO₄ → Na₂SO₄ + 2H₂O',name:'NaOH + серная',type:'exo',energy:'-114 кДж/моль',rc:'#f0f0e8',anim:'boil',desc:'Сильный нагрев! Раствор кипит!',med:'Na₂SO₄ (глауберова соль) — слабительное.',cond:'Осторожно!',products:['Na₂SO₄','H₂O'],danger:1,xp:15},
    {r:['NaOH','HNO3'],eq:'NaOH + HNO₃ → NaNO₃ + H₂O',name:'NaOH + азотная',type:'exo',energy:'-55 кДж/моль',rc:'#f0f0f0',anim:'heat',desc:'Нейтрализация. Прозрачный раствор.',med:'NaNO₃ — консервант (E251).',cond:'t° комнатная',products:['NaNO₃','H₂O'],danger:0,xp:10},
    {r:['Ca_OH_2','CO2'],eq:'Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O',name:'Помутнение известковой воды',type:'exo',energy:'-113 кДж/моль',rc:'#ffffff',anim:'precipitate',desc:'Раствор МУТНЕЕТ — белый осадок CaCO₃!',med:'Качественная реакция на CO₂ в выдыхаемом воздухе.',cond:'t° комнатная',products:['CaCO₃','H₂O'],danger:0,xp:20},
    {r:['CH3COOH','NaOH'],eq:'CH₃COOH + NaOH → CH₃COONa + H₂O',name:'Уксус + щёлочь',type:'exo',energy:'-56 кДж/моль',rc:'#f0f0f0',anim:'heat',desc:'Слабая кислота + сильная щёлочь → ацетат натрия.',med:'Ацетатные буферы в гемодиализе.',cond:'t° комнатная',products:['CH₃COONa','H₂O'],danger:0,xp:10},
    {r:['Ba_OH_2','H2SO4'],eq:'Ba(OH)₂ + H₂SO₄ → BaSO₄↓ + 2H₂O',name:'Осадок BaSO₄',type:'exo',energy:'-120 кДж/моль',rc:'#ffffff',anim:'precipitate',desc:'Белый тяжёлый осадок BaSO₄!',med:'BaSO₄ — рентгеноконтраст для ЖКТ.',cond:'t° комнатная',products:['BaSO₄','H₂O'],danger:0,xp:20},

    {r:['Na','H2O'],eq:'2Na + 2H₂O → 2NaOH + H₂↑',name:'Натрий в воде 💥',type:'exo',energy:'-184 кДж/моль',rc:'#f0f0f0',anim:'explode',desc:'Натрий бегает по воде, ЗАГОРАЕТСЯ! Водород воспламеняется!',med:'Na — основной внеклет. катион. Физраствор.',cond:'ВЗРЫВООПАСНО!',products:['NaOH','H₂'],danger:3,xp:50},
    {r:['K','H2O'],eq:'2K + 2H₂O → 2KOH + H₂↑',name:'Калий в воде 🔥💥',type:'exo',energy:'-196 кДж/моль',rc:'#e0d0ff',anim:'explode',desc:'МГНОВЕННЫЙ ВЗРЫВ! Фиолетовое пламя калия!',med:'K — основной внутриклет. катион.',cond:'ВЗРЫВ!',products:['KOH','H₂'],danger:4,xp:60},
    {r:['Li','H2O'],eq:'2Li + 2H₂O → 2LiOH + H₂↑',name:'Литий в воде',type:'exo',energy:'-222 кДж/моль',rc:'#f0f0f0',anim:'bubble',desc:'Литий реагирует спокойнее — медленно пузырится.',med:'Li₂CO₃ → лечение биполярного расстройства.',cond:'t° комнатная',products:['LiOH','H₂'],danger:1,xp:25},
    {r:['Ca','H2O'],eq:'Ca + 2H₂O → Ca(OH)₂ + H₂↑',name:'Кальций в воде',type:'exo',energy:'-414 кДж/моль',rc:'#f0f0e8',anim:'bubble',desc:'Кальций пузырится, раствор мутнеет.',med:'Ca(OH)₂ в стоматологии.',cond:'t° комнатная',products:['Ca(OH)₂','H₂'],danger:1,xp:25},

    {r:['Fe','HCl'],eq:'Fe + 2HCl → FeCl₂ + H₂↑',name:'Железо + HCl',type:'exo',energy:'-89 кДж/моль',rc:'#90b890',anim:'bubble',desc:'Железо растворяется, раствор ЗЕЛЕНЕЕТ (Fe²⁺), пузырьки H₂!',med:'Дефицит Fe → анемия.',cond:'t° комнатная',products:['FeCl₂','H₂'],danger:0,xp:15},
    {r:['Zn','HCl'],eq:'Zn + 2HCl → ZnCl₂ + H₂↑',name:'Цинк + HCl',type:'exo',energy:'-153 кДж/моль',rc:'#e8e8e8',anim:'bubble',desc:'Цинк активно растворяется — бурные пузырьки H₂!',med:'Zn важен для иммунитета.',cond:'t° комнатная',products:['ZnCl₂','H₂'],danger:0,xp:15},
    {r:['Zn','H2SO4'],eq:'Zn + H₂SO₄(разб.) → ZnSO₄ + H₂↑',name:'Цинк + серная',type:'exo',energy:'-156 кДж/моль',rc:'#e8e8e8',anim:'bubble',desc:'Растворение с пузырьками водорода.',med:'ZnSO₄ в глазных каплях.',cond:'Разбавленная',products:['ZnSO₄','H₂'],danger:0,xp:15},
    {r:['Mg','HCl'],eq:'Mg + 2HCl → MgCl₂ + H₂↑',name:'Магний + HCl',type:'exo',energy:'-462 кДж/моль',rc:'#e8e8e8',anim:'boil',desc:'Магний БУРНО реагирует! Интенсивные пузырьки!',med:'Магнезия — спазмолитик.',cond:'t° комнатная',products:['MgCl₂','H₂'],danger:1,xp:20},
    {r:['Al','HCl'],eq:'2Al + 6HCl → 2AlCl₃ + 3H₂↑',name:'Алюминий + HCl',type:'exo',energy:'-1049 кДж/моль',rc:'#e8e8e8',anim:'bubble',desc:'Сначала медленно (плёнка), затем бурно!',med:'Al(OH)₃ — антациды (Алмагель).',cond:'t° комнатная',products:['AlCl₃','H₂'],danger:1,xp:20},
    {r:['Cu','HNO3'],eq:'3Cu + 8HNO₃ → 3Cu(NO₃)₂ + 2NO↑ + 4H₂O',name:'Медь + азотная 🧡',type:'exo',energy:'-156 кДж/моль',rc:'#1E90FF',anim:'smoke',desc:'Медь → ярко-СИНИЙ раствор Cu²⁺! Бурый ядовитый газ NO₂!',med:'Cu важна для ферментов.',cond:'ЯДОВИТЫЙ ГАЗ!',products:['Cu(NO₃)₂','NO','H₂O'],danger:3,xp:40},
    {r:['Au','HNO3'],eq:'Au + HNO₃ → НЕ РЕАГИРУЕТ',name:'Золото + HNO₃ ❌',type:'neutral',energy:'0',rc:'#FFD700',anim:'none',desc:'Золото НЕ растворяется! Нужна «царская водка» (HCl+HNO₃)!',med:'Au → ауротерапия (ревм. артрит).',cond:'Не реагирует',products:['Au'],danger:0,xp:15},

    {r:['CaCO3','HCl'],eq:'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑',name:'Мрамор + кислота 🫧',type:'exo',energy:'-24 кДж/моль',rc:'#e8f0f8',anim:'fizz',desc:'Мрамор шипит — фонтан пузырьков CO₂!',med:'CaCO₃ — антацид (Ренни).',cond:'Любая t°',products:['CaCl₂','H₂O','CO₂'],danger:0,xp:15},
    {r:['Na2CO3','HCl'],eq:'Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑',name:'Сода + кислота 🫧',type:'exo',energy:'-26 кДж/моль',rc:'#e8e8f0',anim:'fizz',desc:'«Вулкан» — бурное выделение CO₂!',med:'Сода для коррекции ацидоза.',cond:'t° комнатная',products:['NaCl','H₂O','CO₂'],danger:0,xp:15},
    {r:['NaHCO3','HCl'],eq:'NaHCO₃ + HCl → NaCl + H₂O + CO₂↑',name:'Пищевая сода + HCl 🫧',type:'exo',energy:'-12 кДж/моль',rc:'#f0f0f0',anim:'fizz',desc:'Бурные пузырьки CO₂!',med:'Сода — антацид при изжоге.',cond:'t° комнатная',products:['NaCl','H₂O','CO₂'],danger:0,xp:10},
    {r:['NaHCO3','CH3COOH'],eq:'NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂↑',name:'Сода + уксус 🌋',type:'exo',energy:'-10 кДж/моль',rc:'#f0f0e8',anim:'fizz',desc:'Самый знаменитый «вулкан»! Фонтан пены!',med:'Безопасная домашняя реакция.',cond:'t° комнатная',products:['CH₃COONa','H₂O','CO₂'],danger:0,xp:10},
    {r:['CaCO3','CH3COOH'],eq:'CaCO₃ + 2CH₃COOH → Ca(CH₃COO)₂ + H₂O + CO₂↑',name:'Скорлупа + уксус',type:'exo',energy:'-15 кДж/моль',rc:'#f0f0e8',anim:'fizz',desc:'Яичная скорлупа растворяется с пузырьками!',med:'Уксусная кислота — антисептик.',cond:'t° комнатная',products:['Ca(CH₃COO)₂','H₂O','CO₂'],danger:0,xp:15},

    {r:['AgNO3','NaCl'],eq:'AgNO₃ + NaCl → AgCl↓ + NaNO₃',name:'Белый осадок AgCl',type:'neutral',energy:'-65 кДж/моль',rc:'#ffffff',anim:'precipitate',desc:'БЕЛЫЙ ТВОРОЖИСТЫЙ осадок! Качественная на Cl⁻.',med:'Определение хлоридов в моче.',cond:'t° комнатная',products:['AgCl','NaNO₃'],danger:0,xp:20},
    {r:['BaCl2','H2SO4'],eq:'BaCl₂ + H₂SO₄ → BaSO₄↓ + 2HCl',name:'Белый осадок BaSO₄',type:'neutral',energy:'-50 кДж/моль',rc:'#ffffff',anim:'precipitate',desc:'БЕЛЫЙ нерастворимый осадок. Качественная на SO₄²⁻.',med:'BaSO₄ — рентгеноконтраст.',cond:'t° комнатная',products:['BaSO₄','HCl'],danger:0,xp:20},
    {r:['FeCl3','NaOH'],eq:'FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl',name:'БУРЫЙ осадок Fe(OH)₃ 🟤',type:'neutral',energy:'-72 кДж/моль',rc:'#8B4513',anim:'precipitate',desc:'РЫЖЕ-БУРЫЙ осадок! Реакция на Fe³⁺!',med:'Fe(OH)₃ — антидот при отравлении мышьяком!',cond:'t° комнатная',products:['Fe(OH)₃','NaCl'],danger:0,xp:25},
    {r:['CuSO4','NaOH'],eq:'CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄',name:'ГОЛУБОЙ осадок Cu(OH)₂ 🔵',type:'neutral',energy:'-63 кДж/моль',rc:'#4169E1',anim:'precipitate',desc:'НЕЖНО-ГОЛУБОЙ гелеобразный осадок! Красота!',med:'Биуретовая реакция на белки!',cond:'t° комнатная',products:['Cu(OH)₂','Na₂SO₄'],danger:0,xp:25},
    {r:['AgNO3','KI'],eq:'AgNO₃ + KI → AgI↓ + KNO₃',name:'ЖЁЛТЫЙ осадок AgI 🟡',type:'neutral',energy:'-62 кДж/моль',rc:'#FFD700',anim:'precipitate',desc:'ЯРКО-ЖЁЛТЫЙ осадок иодида серебра!',med:'AgI — рентгенографические плёнки.',cond:'t° комнатная',products:['AgI','KNO₃'],danger:0,xp:25},
    {r:['PbNO3_2','KI'],eq:'Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃',name:'«Золотой дождь» ✨',type:'neutral',energy:'-98 кДж/моль',rc:'#FFD700',anim:'golden',desc:'КРАСИВЕЙШАЯ реакция! Золотые кристаллы!',med:'⚠️ Свинец ТОКСИЧЕН!',cond:'горячий → охлаждение',products:['PbI₂','KNO₃'],danger:2,xp:40},
    {r:['Na2S','PbNO3_2'],eq:'Na₂S + Pb(NO₃)₂ → PbS↓ + 2NaNO₃',name:'ЧЁРНЫЙ осадок PbS ⚫',type:'neutral',energy:'-85 кДж/моль',rc:'#1a1a1a',anim:'precipitate',desc:'ЧЁРНЫЙ осадок!',med:'Реакция на свинец в биожидкостях.',cond:'t° комнатная',products:['PbS','NaNO₃'],danger:2,xp:30},

    {r:['Cu','AgNO3'],eq:'Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag↓',name:'Дерево серебра 🌲',type:'exo',energy:'-148 кДж/моль',rc:'#87CEEB',anim:'crystals',desc:'На меди «иголки» серебра! Раствор голубеет!',med:'AgNO₃ (ляпис) — антисептик.',cond:'t° комнатная',products:['Cu(NO₃)₂','Ag'],danger:0,xp:30},
    {r:['Fe','CuSO4'],eq:'Fe + CuSO₄ → FeSO₄ + Cu↓',name:'Красная медь на железе',type:'exo',energy:'-153 кДж/моль',rc:'#90EE90',anim:'coat',desc:'На гвозде — КРАСНЫЙ налёт меди! Раствор зеленеет!',med:'Болезнь Вильсона — нарушение обмена Cu.',cond:'t° комнатная',products:['FeSO₄','Cu'],danger:0,xp:25},
    {r:['Zn','CuSO4'],eq:'Zn + CuSO₄ → ZnSO₄ + Cu↓',name:'Цинк → медь',type:'exo',energy:'-218 кДж/моль',rc:'#e0e8e0',anim:'coat',desc:'Красный налёт Cu на цинке. Раствор обесцвечивается!',med:'Zn и Cu — микроэлементы.',cond:'t° комнатная',products:['ZnSO₄','Cu'],danger:0,xp:25},

    {r:['H','O'],eq:'2H₂ + O₂ → 2H₂O',name:'Гремучий газ 🔥💥',type:'exo',energy:'-572 кДж/моль',rc:'#a8d8ff',anim:'explode',desc:'ГРЕМУЧИЙ ГАЗ! H₂+O₂ → мощный ВЗРЫВ!',med:'Вода — 60% массы человека.',cond:'t° > 500°C',products:['H₂O'],danger:4,xp:50},
    {r:['C','O'],eq:'C + O₂ → CO₂',name:'Горение углерода',type:'exo',energy:'-393 кДж/моль',rc:'#e0e0e0',anim:'burn',desc:'Углерод горит, образуя CO₂.',med:'CO₂ — конечный продукт дыхания.',cond:'Поджиг',products:['CO₂'],danger:1,xp:15},
    {r:['S','O'],eq:'S + O₂ → SO₂',name:'Голубое пламя серы 🔵',type:'exo',energy:'-297 кДж/моль',rc:'#6495ED',anim:'burn',desc:'Сера горит ГОЛУБЫМ пламенем! Резкий запах!',med:'SO₂ — Е220 (консервант).',cond:'Поджиг',products:['SO₂'],danger:2,xp:25},
    {r:['Fe','O'],eq:'4Fe + 3O₂ → 2Fe₂O₃',name:'Горение железа 🔥',type:'exo',energy:'-1648 кДж/моль',rc:'#8B0000',anim:'sparks',desc:'В чистом O₂ железо ГОРИТ яркими ИСКРАМИ!',med:'Fe в гемоглобине → транспорт O₂.',cond:'В чистом O₂',products:['Fe₂O₃'],danger:2,xp:30},
    {r:['Mg','O'],eq:'2Mg + O₂ → 2MgO',name:'Ослепительная вспышка ☀️',type:'exo',energy:'-1204 кДж/моль',rc:'#ffffff',anim:'flash',desc:'ОСЛЕПИТЕЛЬНЫЙ белый свет! НЕ смотреть!',med:'MgO — антацид. Mg — 600+ ферментов.',cond:'Поджиг',products:['MgO'],danger:3,xp:40},
    {r:['P','O'],eq:'4P + 5O₂ → 2P₂O₅',name:'Фосфор горит ☠️🔥',type:'exo',energy:'-3010 кДж/моль',rc:'#fffde8',anim:'burn',desc:'Белый фосфор САМОВОСПЛАМЕНЯЕТСЯ!',med:'Фосфорные ожоги — тяжелейшие!',cond:'t° > 34°C',products:['P₂O₅'],danger:5,xp:60},
    {r:['CH4','O'],eq:'CH₄ + 2O₂ → CO₂ + 2H₂O',name:'Горение метана 🔥',type:'exo',energy:'-890 кДж/моль',rc:'#a0c0ff',anim:'burn',desc:'Природный газ → синее пламя. Утечка → ВЗРЫВ!',med:'Метан → асфиксия.',cond:'Поджиг',products:['CO₂','H₂O'],danger:3,xp:35},
    {r:['C2H2','O'],eq:'2C₂H₂ + 5O₂ → 4CO₂ + 2H₂O',name:'Горение ацетилена 🔥',type:'exo',energy:'-2600 кДж/моль',rc:'#FFD700',anim:'burn',desc:'Яркое коптящее пламя! Сварка (3000°C)!',med:'Ацетилен ВЗРЫВООПАСЕН!',cond:'Поджиг',products:['CO₂','H₂O'],danger:4,xp:45},
    {r:['C2H5OH','O'],eq:'C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O',name:'Горение спирта 🔥',type:'exo',energy:'-1367 кДж/моль',rc:'#a8c0ff',anim:'burn',desc:'Почти невидимое голубоватое пламя!',med:'70% этанол — антисептик.',cond:'Поджиг',products:['CO₂','H₂O'],danger:2,xp:25},
    {r:['C3H8','O'],eq:'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O',name:'Горение пропана 💥',type:'exo',energy:'-2220 кДж/моль',rc:'#ffe0a0',anim:'explode',desc:'Газовый баллон! Утечка → ВЗРЫВ!',med:'Ожоги пропаном — частая травма.',cond:'Поджиг',products:['CO₂','H₂O'],danger:4,xp:45},

    {r:['N','H'],eq:'N₂ + 3H₂ ⇌ 2NH₃',name:'Синтез аммиака (Габер)',type:'exo',energy:'-92 кДж/моль',rc:'#e0ffe0',anim:'heat',desc:'Важнейшая промышленная реакция! Fe, 450°C, 200 атм.',med:'NH₃ → мочевина. Печ. недостаточность.',cond:'450°C, 200 атм',products:['NH₃'],danger:1,xp:35},
    {r:['Na','Cl'],eq:'2Na + Cl₂ → 2NaCl',name:'Натрий + хлор 💥🔥',type:'exo',energy:'-822 кДж/моль',rc:'#ffffff',anim:'explode',desc:'ЯРКАЯ вспышка! Натрий ГОРИТ в хлоре → поваренная соль!',med:'NaCl 0.9% — физраствор.',cond:'Поджиг',products:['NaCl'],danger:4,xp:50},
    {r:['Fe','S'],eq:'Fe + S → FeS',name:'Железо + сера',type:'exo',energy:'-100 кДж/моль',rc:'#4a4a30',anim:'burn',desc:'Смесь порошков → вспышка! Сульфид железа.',med:'H₂S — регулятор тонуса сосудов.',cond:'Нагрев',products:['FeS'],danger:1,xp:20},
    {r:['CaO','H2O'],eq:'CaO + H₂O → Ca(OH)₂',name:'Гашение извести 🔥',type:'exo',energy:'-65 кДж/моль',rc:'#f8f8f0',anim:'boil',desc:'Негашёная известь + вода = СИЛЬНЫЙ нагрев! Пар, кипение!',med:'Ca(OH)₂ в стоматологии.',cond:'t° комнатная',products:['Ca(OH)₂'],danger:2,xp:25},

    {r:['H2O2','MnO2'],eq:'2H₂O₂ → 2H₂O + O₂↑ (кат. MnO₂)',name:'«Зубная паста слона» 🐘',type:'exo',energy:'-196 кДж',rc:'#e8f0ff',anim:'foam',desc:'Перекись БУРНО разлагается! Пена, кислород!',med:'H₂O₂ 3% — антисептик для ран.',cond:'Кат. MnO₂',products:['H₂O','O₂'],danger:1,xp:25},
    {r:['KMnO4','H2SO4'],eq:'2KMnO₄ + H₂SO₄ → Mn₂O₇ + K₂SO₄ + H₂O',name:'Марганцовка + серная ☠️🔥',type:'exo',energy:'-312 кДж',rc:'#4B0082',anim:'explode',desc:'КРАЙНЕ ОПАСНО! Mn₂O₇ может ВЗОРВАТЬСЯ!',med:'KMnO₄ (марганцовка) — антисептик.',cond:'Конц. H₂SO₄',products:['Mn₂O₇','K₂SO₄','H₂O'],danger:5,xp:70},
    {r:['Al','Fe2O3'],eq:'2Al + Fe₂O₃ → Al₂O₃ + 2Fe',name:'ТЕРМИТ 🔥💥☠️',type:'exo',energy:'-852 кДж/моль',rc:'#FF4500',anim:'thermite',desc:'t° > 2500°C! РАСПЛАВЛЕННОЕ железо! Горит под водой!',med:'Ожоги термитом — катастрофические.',cond:'Mg как запал',products:['Al₂O₃','Fe'],danger:5,xp:80},
    {r:['H2O2','KMnO4'],eq:'5H₂O₂ + 2KMnO₄ → 5O₂↑ + 2MnO₂ + 2KOH + 3H₂O',name:'Перекись + марганцовка',type:'exo',energy:'-196 кДж',rc:'#DDA0DD',anim:'foam',desc:'Фиолетовый → обесцвечивается! Бурный O₂!',med:'Оба — антисептики.',cond:'t° комнатная',products:['O₂','MnO₂','KOH','H₂O'],danger:1,xp:25},
    {r:['NH3','HCl'],eq:'NH₃ + HCl → NH₄Cl',name:'«Дым без огня» 💨',type:'exo',energy:'-176 кДж/моль',rc:'#f0f0f0',anim:'smoke',desc:'Белый «дым» (аэрозоль NH₄Cl)!',med:'Нашатырный спирт при обмороках.',cond:'Газовая фаза',products:['NH₄Cl'],danger:1,xp:25},

    {r:['Na','C2H5OH'],eq:'2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂↑',name:'Натрий + этанол',type:'exo',energy:'-90 кДж/моль',rc:'#f0e8d8',anim:'bubble',desc:'Натрий медленно реагирует с этанолом.',med:'Этилат натрия — реагент.',cond:'t° комнатная',products:['C₂H₅ONa','H₂'],danger:2,xp:30},
    {r:['HCN','NaOH'],eq:'HCN + NaOH → NaCN + H₂O',name:'Синильная кислота + NaOH ☠️',type:'exo',energy:'-42 кДж/моль',rc:'#f0f0e8',anim:'toxic',desc:'СИНИЛЬНАЯ КИСЛОТА — СМЕРТЕЛЬНА!',med:'HCN блокирует цитохромоксидазу. Антидот: амилнитрит.',cond:'t° комнатная',products:['NaCN','H₂O'],danger:5,xp:60},
    {r:['Hg','HNO3'],eq:'3Hg + 8HNO₃ → 3Hg(NO₃)₂ + 2NO↑ + 4H₂O',name:'Ртуть + азотная ☠️',type:'exo',energy:'-140 кДж/моль',rc:'#c0c0c0',anim:'toxic',desc:'Пары ртути КРАЙНЕ ЯДОВИТЫ!',med:'Отравление ртутью. Антидот — унитиол.',cond:'t° комнатная',products:['Hg(NO₃)₂','NO','H₂O'],danger:5,xp:60},
    {r:['K2Cr2O7','H2SO4'],eq:'K₂Cr₂O₇ + H₂SO₄ → хромовая смесь ☠️',name:'Хромовая смесь ☠️',type:'exo',energy:'-200 кДж',rc:'#FF4500',anim:'toxic',desc:'Мощнейший ОКИСЛИТЕЛЬ! Cr⁶⁺ — канцероген!',med:'Хром(VI) → рак лёгких.',cond:'Конц. H₂SO₄',products:['CrO₃','K₂SO₄','H₂O'],danger:5,xp:60},
    {r:['C6H6','Br'],eq:'C₆H₆ + Br₂ → C₆H₅Br + HBr',name:'Бромирование бензола',type:'exo',energy:'-50 кДж/моль',rc:'#DEB887',anim:'smoke',desc:'Замещение H на Br. Бром — ЕДКИЙ!',med:'Бром вызывает ожоги.',cond:'Кат. FeBr₃',products:['C₆H₅Br','HBr'],danger:3,xp:35},

    {r:['C6H12O6','O'],eq:'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O',name:'Клеточное дыхание 🫁',type:'exo',energy:'-2803 кДж/моль',rc:'#e8e0d0',anim:'glow',desc:'КЛЕТОЧНОЕ ДЫХАНИЕ! Энергия жизни!',med:'Глюкоза 5% — р-р для капельниц. Диабет.',cond:'Ферменты, 37°C',products:['CO₂','H₂O'],danger:0,xp:30},
    {r:['FeSO4','KMnO4'],eq:'10FeSO₄ + 2KMnO₄ + 8H₂SO₄ → ...',name:'Перманганатометрия',type:'exo',energy:'-500 кДж',rc:'#90EE90',anim:'decolor',desc:'Фиолетовый KMnO₄ ОБЕСЦВЕЧИВАЕТСЯ! Титрование.',med:'Определение Fe²⁺ в крови.',cond:'Кислая среда',products:['Fe₂(SO₄)₃','MnSO₄'],danger:0,xp:30},

    {r:['phenol','NaOH'],eq:'Фенолфталеин в щёлочи → МАЛИНОВЫЙ',name:'Малиновый цвет! 🩷',type:'neutral',energy:'0',rc:'#FF1493',anim:'color',desc:'Бесцветный → ЯРКИЙ МАЛИНОВЫЙ! pH > 8.2',med:'Фенолфталеин (пурген) — слабительное.',cond:'pH > 8.2',products:['Малиновый р-р'],danger:0,xp:20},
    {r:['litmus','HCl'],eq:'Лакмус + кислота → КРАСНЫЙ',name:'Лакмус краснеет! 🔴',type:'neutral',energy:'0',rc:'#DC143C',anim:'color',desc:'Фиолетовый → КРАСНЫЙ в кислоте!',med:'Экспресс-определение pH.',cond:'pH < 5',products:['Красный р-р'],danger:0,xp:15},
    {r:['litmus','NaOH'],eq:'Лакмус + щёлочь → СИНИЙ',name:'Лакмус синеет! 🔵',type:'neutral',energy:'0',rc:'#0000CD',anim:'color',desc:'Фиолетовый → СИНИЙ в щёлочи!',med:'Определение pH мочи, слюны.',cond:'pH > 8',products:['Синий р-р'],danger:0,xp:15},
    {r:['methyl_o','HCl'],eq:'Метилоранж + кислота → КРАСНЫЙ',name:'Метилоранж краснеет!',type:'neutral',energy:'0',rc:'#FF4500',anim:'color',desc:'Оранжевый → КРАСНЫЙ в кислоте!',med:'Титрование лекарственных р-ров.',cond:'pH < 3.1',products:['Красный р-р'],danger:0,xp:15},

    {r:['H2S','FeCl3'],eq:'H₂S + 2FeCl₃ → S↓ + 2FeCl₂ + 2HCl',name:'Сера выпадает!',type:'exo',energy:'-80 кДж/моль',rc:'#FFFF00',anim:'precipitate',desc:'ЖЁЛТЫЙ осадок серы! H₂S — тухлые яйца!',med:'H₂S — газотрансмиттер.',cond:'t° комнатная',products:['S','FeCl₂','HCl'],danger:3,xp:30},
    {r:['Na2O','H2O'],eq:'Na₂O + H₂O → 2NaOH',name:'Оксид натрия + вода',type:'exo',energy:'-146 кДж/моль',rc:'#f0f0f8',anim:'boil',desc:'Оксид + вода → щёлочь! Сильный нагрев!',med:'NaOH разъедает кожу!',cond:'t° комнатная',products:['NaOH'],danger:2,xp:20},
    {r:['SO2','H2O'],eq:'SO₂ + H₂O → H₂SO₃',name:'Кислотный дождь ☔',type:'exo',energy:'-42 кДж/моль',rc:'#e8e8d0',anim:'heat',desc:'Причина кислотных дождей!',med:'SO₂ → бронхоспазм у астматиков.',cond:'t° комнатная',products:['H₂SO₃'],danger:2,xp:20},
    {r:['CO2','H2O'],eq:'CO₂ + H₂O ⇌ H₂CO₃',name:'Газировка! 🥤',type:'neutral',energy:'-20 кДж/моль',rc:'#e0f0ff',anim:'fizz',desc:'Газированная вода! CO₂ + H₂O → угольная кислота.',med:'Бикарбонатный буфер крови.',cond:'t° комнатная',products:['H₂CO₃'],danger:0,xp:10},
    {r:['NH4Cl','NaOH'],eq:'NH₄Cl + NaOH → NaCl + NH₃↑ + H₂O',name:'Аммиак выделяется!',type:'endo',energy:'+16 кДж/моль',rc:'#e0ffe0',anim:'smoke',desc:'Резкий запах NH₃! Лакмус синеет от паров!',med:'Нашатырный спирт → пробуждение.',cond:'Нагрев',products:['NaCl','NH₃','H₂O'],danger:1,xp:20}
];

let tableItems=[], flaskItems=[], history=[], totalReactions=0;
let xp=0, level=1, combo=0, comboTimer=null;
let discoveredReactions=new Set(), achievements=[];
let activeCategory='all', searchQuery='';

const ACHIEVEMENTS_LIST=[
    {id:'first',icon:'🧪',name:'Первая реакция',desc:'Проведи первую реакцию',check:()=>totalReactions>=1},
    {id:'five',icon:'🔬',name:'Начинающий химик',desc:'Проведи 5 реакций',check:()=>totalReactions>=5},
    {id:'ten',icon:'⚗️',name:'Лаборант',desc:'Проведи 10 реакций',check:()=>totalReactions>=10},
    {id:'twenty',icon:'👨‍🔬',name:'Учёный',desc:'Проведи 20 реакций',check:()=>totalReactions>=20},
    {id:'fifty',icon:'🏆',name:'Профессор химии',desc:'Проведи 50 реакций',check:()=>totalReactions>=50},
    {id:'disc5',icon:'🗺️',name:'Исследователь',desc:'Открой 5 уникальных реакций',check:()=>discoveredReactions.size>=5},
    {id:'disc15',icon:'📖',name:'Энциклопедист',desc:'Открой 15 уникальных реакций',check:()=>discoveredReactions.size>=15},
    {id:'disc30',icon:'🌟',name:'Мастер реакций',desc:'Открой 30 уникальных реакций',check:()=>discoveredReactions.size>=30},
    {id:'danger',icon:'☠️',name:'Смельчак',desc:'Проведи опасную реакцию',check:()=>history.some(h=>h.danger>=3)},
    {id:'deadly',icon:'💀',name:'Безумный учёный',desc:'Проведи смертельную реакцию',check:()=>history.some(h=>h.danger>=5)},
    {id:'combo3',icon:'🔥',name:'Комбо x3',desc:'Сделай 3 реакции подряд',check:()=>combo>=3},
    {id:'combo5',icon:'💥',name:'Комбо x5',desc:'Сделай 5 реакций подряд',check:()=>combo>=5},
    {id:'lvl5',icon:'⭐',name:'Уровень 5',desc:'Достигни 5 уровня',check:()=>level>=5},
    {id:'lvl10',icon:'🌙',name:'Уровень 10',desc:'Достигни 10 уровня',check:()=>level>=10},
    {id:'indicator',icon:'🎨',name:'Колорист',desc:'Проведи индикаторную реакцию',check:()=>history.some(h=>h.name.includes('Лакмус')||h.name.includes('Малинов')||h.name.includes('Метилоранж'))}
];

const CATEGORIES=[
    {key:'all',label:'🧪 Все'},{key:'nonmetal',label:'Неметаллы'},{key:'alkali',label:'🔥 Щелочные'},
    {key:'alkaline',label:'Щёл.зем.'},{key:'transition',label:'⚙️ Переходные'},{key:'metal',label:'Металлы'},
    {key:'halogen',label:'Галогены'},{key:'noble',label:'Благородные'},{key:'acid',label:'🧫 Кислоты'},
    {key:'base',label:'Основания'},{key:'salt',label:'🧂 Соли'},{key:'oxide',label:'Оксиды'},
    {key:'organic',label:'🌿 Органика'},{key:'compound',label:'Вещества'},{key:'indicator',label:'🎨 Индикаторы'}
];

function xpForLevel(l){return l*80;}
function calcLevel(){let t=0,l=1;while(true){t+=xpForLevel(l);if(xp<t)break;l++;}return l;}

function init(){
    loadState();
    renderCategoryFilters();
    renderShelf();
    renderTable();
    renderFlask();
    renderHistory();
    renderGameBar();
    bindSearch();
    console.log('✅ ChemLab v3 GAME: '+REACTIONS.length+' reactions, '+Object.keys(SUBSTANCES).length+' substances');
}

function renderGameBar(){
    const bar=document.getElementById('chem-game-bar');
    if(!bar)return;
    const prevXp=Array.from({length:level-1},(_,i)=>xpForLevel(i+1)).reduce((a,b)=>a+b,0);
    const needed=xpForLevel(level), current=xp-prevXp;
    const pct=Math.min(100,(current/needed*100));
    bar.innerHTML=`
        <div class="game-level">
            <span class="game-level-badge">Ур. ${level}</span>
            <div class="game-xp-bar"><div class="game-xp-fill" style="width:${pct}%"></div></div>
            <span class="game-xp-text">${current}/${needed} XP</span>
        </div>
        <div class="game-stats-row">
            <div class="game-stat"><span class="game-stat-value">${totalReactions}</span><span class="game-stat-label">Реакций</span></div>
            <div class="game-stat"><span class="game-stat-value">${discoveredReactions.size}/${REACTIONS.length}</span><span class="game-stat-label">Открыто</span></div>
            ${combo>=2?'<div class="game-stat combo-glow"><span class="game-stat-value">x'+combo+'</span><span class="game-stat-label">Комбо!</span></div>':''}
        </div>`;
}

function renderCategoryFilters(){
    const c=document.getElementById('chem-cat-filters');
    if(!c)return;
    c.innerHTML=CATEGORIES.map(cat=>'<div class="chem-cat-chip'+(cat.key===activeCategory?' active':'')+'" onclick="ChemLab.filterCategory(\''+cat.key+'\')">'+cat.label+'</div>').join('');
}

function filterCategory(cat){activeCategory=cat;renderCategoryFilters();renderShelf();}

function isLight(hex){
    if(!hex||hex.length<7)return true;
    const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
    return(r*0.299+g*0.587+b*0.114)>150;
}

function renderShelf(){
    const c=document.getElementById('chem-shelf');
    if(!c)return;
    const filtered=Object.values(SUBSTANCES).filter(s=>{
        const matchCat=activeCategory==='all'||s.cat===activeCategory;
        const matchSearch=!searchQuery||s.name.toLowerCase().includes(searchQuery)||s.symbol.toLowerCase().includes(searchQuery)||s.id.toLowerCase().includes(searchQuery);
        return matchCat&&matchSearch;
    });
    if(!filtered.length){c.innerHTML='<div style="grid-column:1/-1;text-align:center;color:rgba(255,255,255,0.3);padding:30px">🔍 Ничего не найдено</div>';return;}
    c.innerHTML=filtered.map(s=>{
        const onT=tableItems.includes(s.id);
        return '<div class="chem-bottle'+(onT?' on-table':'')+'" onclick="ChemLab.addToTable(\''+s.id+'\')" title="'+s.name+' — '+s.rc+'">'
            +(s.num?'<span class="bottle-number">'+s.num+'</span>':'')
            +'<div class="bottle-icon" style="background:'+s.color+';color:'+(isLight(s.color)?'#222':'#fff')+'">'+s.symbol+'</div>'
            +'<div class="bottle-name">'+s.name+'</div>'
            +'<div class="bottle-real-color">'+s.rc+'</div>'
            +'</div>';
    }).join('');
}

function bindSearch(){
    const i=document.getElementById('chem-search-input');
    if(!i)return;
    i.addEventListener('input',function(){searchQuery=this.value.toLowerCase().trim();renderShelf();});
}

function addToTable(id){
    if(tableItems.includes(id)){removeFromTable(id);return;}
    if(tableItems.length>=5){toast('📦 Макс 5 веществ на столе');return;}
    tableItems.push(id);
    renderTable();renderShelf();
    if(tableItems.length>=2)checkHint();
}

function removeFromTable(id){
    tableItems=tableItems.filter(x=>x!==id);
    flaskItems=flaskItems.filter(x=>x!==id);
    renderTable();renderShelf();renderFlask();
}

function renderTable(){
    const c=document.getElementById('chem-table-items');
    if(!c)return;
    if(!tableItems.length){c.innerHTML='<div class="table-empty">Нажми на вещество на полке ☝️</div>';return;}
    c.innerHTML=tableItems.map(id=>{
        const s=SUBSTANCES[id];if(!s)return'';
        const inF=flaskItems.includes(id);
        return '<div class="table-substance'+(inF?' in-flask':'')+'" onclick="ChemLab.pourToFlask(\''+id+'\')">'
            +'<span class="sub-symbol" style="background:'+s.color+';color:'+(isLight(s.color)?'#222':'#fff')+'">'+s.symbol+'</span>'
            +'<span class="sub-name">'+s.name+'</span>'
            +'<div class="sub-remove" onclick="event.stopPropagation();ChemLab.removeFromTable(\''+id+'\')">×</div>'
            +'</div>';
    }).join('');
}

function pourToFlask(id){
    if(flaskItems.includes(id)){flaskItems=flaskItems.filter(x=>x!==id);}
    else{if(flaskItems.length>=3){toast('🧪 Макс 3 вещества в колбе');return;}flaskItems.push(id);}
    renderFlask();renderTable();
}

function renderFlask(){
    const liquid=document.querySelector('#chem-flask .flask-liquid');
    const tags=document.querySelector('#chem-flask .flask-tags');
    if(!liquid||!tags)return;
    if(flaskItems.length>0){
        liquid.classList.add('has-content');
        const colors=flaskItems.map(id=>SUBSTANCES[id]?.color||'#6c5ce7');
        liquid.style.background=colors.length===1?colors[0]:'linear-gradient(180deg,'+colors.map((c,i)=>c+' '+(i*100/(colors.length-1))+'%').join(',')+')';
        liquid.style.opacity='0.85';
        tags.innerHTML=flaskItems.map(id=>'<span class="flask-tag">'+(SUBSTANCES[id]?.symbol||id)+'</span>').join('');
    }else{
        liquid.classList.remove('has-content','bubbling');
        liquid.style.background='';liquid.style.opacity='';
        tags.innerHTML='';
    }
}

function checkHint(){
    for(let i=0;i<tableItems.length;i++){
        for(let j=i+1;j<tableItems.length;j++){
            const pair=[tableItems[i],tableItems[j]].sort().join(',');
            for(const r of REACTIONS){
                if([...r.r].sort().join(',')===pair){
                    const h=document.getElementById('chem-hint');
                    if(h){h.innerHTML='💡 <strong>'+SUBSTANCES[tableItems[i]]?.name+'</strong> + <strong>'+SUBSTANCES[tableItems[j]]?.name+'</strong> — можно смешать!';h.classList.add('visible');setTimeout(()=>h.classList.remove('visible'),5000);}
                    return;
                }
            }
        }
    }
}

function getRandomHint(){
    const und=REACTIONS.filter(r=>!discoveredReactions.has(r.name));
    const pool=und.length>0?und:REACTIONS;
    const r=pool[Math.floor(Math.random()*pool.length)];
    toast('💡 Подсказка: смешай '+(SUBSTANCES[r.r[0]]?.name||r.r[0])+' и '+(SUBSTANCES[r.r[1]]?.name||r.r[1])+'!');
}

function mixReactants(){
    if(flaskItems.length<2){toast('Добавь минимум 2 вещества в колбу!');return;}
    const reaction=findReaction(flaskItems);
    if(!reaction){showNoReaction();return;}
    playReaction(reaction);
}

function findReaction(items){
    for(const r of REACTIONS){
        const rSet=[...r.r].sort().join(',');
        for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++){
            if([items[i],items[j]].sort().join(',')===rSet)return r;
        }
    }
    return null;
}

function playReaction(reaction){
    const zone=document.querySelector('.chem-workbench');
    const btn=document.querySelector('.chem-mix-btn');
    const flask=document.querySelector('#chem-flask');

    if(btn){btn.classList.add('reacting');setTimeout(()=>btn.classList.remove('reacting'),800);}
    if(reaction.danger>=3){zone?.classList.add('shake-danger');setTimeout(()=>zone?.classList.remove('shake-danger'),600);}

    spawnParticles(flask,reaction);
    const anim=reaction.anim||'heat';
    if(['explode','thermite'].includes(anim)){spawnFireSparks(flask);spawnSmoke(flask);}
    else if(['burn','sparks','flash'].includes(anim)){spawnFireSparks(flask);}
    else if(anim==='smoke'||anim==='toxic'){spawnSmoke(flask);}
    else if(['fizz','foam','boil'].includes(anim)){spawnBubbles(flask);}
    else if(['precipitate','golden'].includes(anim)){spawnPrecipitate(flask,reaction.rc);}

    if(flask){
        const flash=document.createElement('div');flash.className='explosion-flash';
        if(reaction.danger>=4)flash.style.background='radial-gradient(circle,rgba(255,100,0,0.8),transparent)';
        else if(anim==='color')flash.style.background='radial-gradient(circle,'+reaction.rc+'88,transparent)';
        flask.appendChild(flash);setTimeout(()=>flash.remove(),500);
    }

    setTimeout(()=>{
        const liquid=document.querySelector('#chem-flask .flask-liquid');
        if(liquid){liquid.style.background=reaction.rc;liquid.style.opacity='1';liquid.classList.add('bubbling');setTimeout(()=>liquid.classList.remove('bubbling'),3000);}
        if(flask){flask.style.setProperty('--glow-color',reaction.danger>=3?'rgba(255,71,87,0.6)':reaction.rc+'88');flask.classList.add('flask-glow');setTimeout(()=>flask.classList.remove('flask-glow'),3000);}
    },300);

    setTimeout(()=>{
        const eqBox=document.getElementById('chem-equation-box');
        if(eqBox){eqBox.innerHTML=formatEquation(reaction.eq);eqBox.classList.add('visible');}
    },500);
    setTimeout(()=>showInfoCard(reaction),700);

    const isNew=!discoveredReactions.has(reaction.name);
    discoveredReactions.add(reaction.name);
    let earnedXp=reaction.xp||10;
    if(isNew)earnedXp=Math.round(earnedXp*1.5);

    combo++;
    clearTimeout(comboTimer);
    comboTimer=setTimeout(()=>{combo=0;renderGameBar();},15000);
    if(combo>=3)earnedXp=Math.round(earnedXp*(1+combo*0.1));

    xp+=earnedXp;totalReactions++;
    const oldLevel=level;level=calcLevel();
    if(level>oldLevel)showLevelUp(level);
    showXpPopup(earnedXp,isNew,combo);
    checkAchievements();
    addToHistory(reaction);
    renderHistory();renderGameBar();saveState();
    if(navigator.vibrate)navigator.vibrate(reaction.danger>=3?[100,50,100]:80);
}

function showNoReaction(){
    const names=flaskItems.map(id=>SUBSTANCES[id]?.name||id).join(' + ');
    const eqBox=document.getElementById('chem-equation-box');
    if(eqBox){eqBox.innerHTML='<span style="color:rgba(255,255,255,0.4)">❌ '+names+' — реакция не идёт</span>';eqBox.classList.add('visible');}
    hideInfoCard();combo=0;renderGameBar();
    toast('Эти вещества не реагируют 🤔 Попробуй другие!');
}

function showXpPopup(amount,isNew,currentCombo){
    const p=document.createElement('div');p.className='xp-popup';
    let t='+'+amount+' XP';if(isNew)t+=' 🆕';if(currentCombo>=3)t+=' (x'+currentCombo+' комбо!)';
    p.textContent=t;document.body.appendChild(p);
    requestAnimationFrame(()=>p.classList.add('show'));
    setTimeout(()=>{p.classList.remove('show');setTimeout(()=>p.remove(),300);},2000);
}

function showLevelUp(newLevel){
    const o=document.createElement('div');o.className='level-up-overlay';
    o.innerHTML='<div class="level-up-card"><div class="level-up-icon">⭐</div><h3>УРОВЕНЬ '+newLevel+'!</h3><p>Ты становишься настоящим химиком!</p></div>';
    document.body.appendChild(o);requestAnimationFrame(()=>o.classList.add('show'));
    setTimeout(()=>{o.classList.remove('show');setTimeout(()=>o.remove(),500);},3000);
    if(navigator.vibrate)navigator.vibrate([100,100,200]);
}

function checkAchievements(){
    for(const a of ACHIEVEMENTS_LIST){
        if(achievements.includes(a.id))continue;
        if(a.check()){achievements.push(a.id);showAchievement(a);}
    }
}

function showAchievement(a){
    const e=document.createElement('div');e.className='achievement-popup';
    e.innerHTML='<span class="ach-icon">'+a.icon+'</span><div><strong>Достижение!</strong><br>'+a.name+'</div>';
    document.body.appendChild(e);requestAnimationFrame(()=>e.classList.add('show'));
    setTimeout(()=>{e.classList.remove('show');setTimeout(()=>e.remove(),300);},3500);
    if(navigator.vibrate)navigator.vibrate([50,50,100]);
}

function showInfoCard(r){
    const card=document.getElementById('chem-info-card');if(!card)return;
    const tl=r.type==='exo'?'🔥 Экзотермическая':r.type==='endo'?'❄️ Эндотермическая':'🔄 Обменная';
    const db='⚠️'.repeat(Math.min(r.danger,5));
    card.innerHTML='<div class="info-card-header"><h4>'+r.name+'</h4><span class="reaction-badge badge-'+r.type+'">'+tl+'</span>'
        +(r.danger>=3?'<span class="reaction-badge badge-danger">☠️ ОПАСНО</span>':'')+'</div>'
        +'<div class="info-card-body"><div class="info-details-grid">'
        +'<div class="info-detail"><div class="info-detail-label">Энергия</div><div class="info-detail-value">'+r.energy+'</div></div>'
        +'<div class="info-detail"><div class="info-detail-label">Условия</div><div class="info-detail-value">'+r.cond+'</div></div>'
        +'<div class="info-detail"><div class="info-detail-label">Продукты</div><div class="info-detail-value">'+r.products.join(', ')+'</div></div>'
        +'<div class="info-detail"><div class="info-detail-label">Опасность</div><div class="info-detail-value">'+(r.danger===0?'✅ Безопасно':db+' '+r.danger+'/5')+'</div></div>'
        +'<div class="info-detail"><div class="info-detail-label">XP</div><div class="info-detail-value">+'+( r.xp||10)+'</div></div>'
        +'</div><div class="info-description">'+r.desc+'</div>'
        +(r.med?'<div class="info-medical"><h5>🏥 Медицина</h5><p>'+r.med+'</p></div>':'')
        +(r.danger>=3?'<div class="info-danger-warning">☠️ <strong>НЕ ПОВТОРЯТЬ</strong> без профессионального надзора!</div>':'')
        +'</div>';
    card.classList.add('visible');
}

function hideInfoCard(){const c=document.getElementById('chem-info-card');if(c)c.classList.remove('visible');}

function formatEquation(eq){
    return eq.replace(/→/g,'<span class="eq-arrow">→</span>')
        .replace(/⇌/g,'<span class="eq-arrow">⇌</span>')
        .replace(/↑/g,'<span class="eq-state gas">↑</span>')
        .replace(/↓/g,'<span class="eq-state ppt">↓</span>');
}

function spawnParticles(target,reaction){
    if(!target)return;
    const count=reaction.danger>=3?35:18;
    for(let i=0;i<count;i++){
        const p=document.createElement('div');p.className='reaction-particle';
        const angle=(Math.PI*2/count)*i+Math.random()*0.5;
        const dist=30+Math.random()*(reaction.danger>=3?130:70);
        p.style.left=target.offsetWidth/2+'px';p.style.top=target.offsetHeight/2+'px';
        p.style.setProperty('--dx',Math.cos(angle)*dist+'px');
        p.style.setProperty('--dy',Math.sin(angle)*dist+'px');
        p.style.setProperty('--dur',(0.4+Math.random()*0.5)+'s');
        p.style.background=reaction.rc||'#6c5ce7';
        p.style.width=(3+Math.random()*5)+'px';p.style.height=p.style.width;
        target.appendChild(p);setTimeout(()=>p.remove(),1500);
    }
}

function spawnSmoke(target){
    if(!target)return;
    for(let i=0;i<6;i++){setTimeout(()=>{
        const s=document.createElement('div');s.className='smoke-puff';
        s.style.left=(target.offsetWidth/2-15+Math.random()*30)+'px';
        s.style.top=(target.offsetHeight*0.3)+'px';
        target.appendChild(s);setTimeout(()=>s.remove(),2500);
    },i*120);}
}

function spawnFireSparks(target){
    if(!target)return;
    for(let i=0;i<15;i++){
        const f=document.createElement('div');f.className='fire-spark';
        const angle=Math.random()*Math.PI*2;const dist=20+Math.random()*70;
        f.style.left=target.offsetWidth/2+'px';f.style.top=target.offsetHeight*0.3+'px';
        f.style.setProperty('--dx',Math.cos(angle)*dist+'px');
        f.style.setProperty('--dy',(Math.sin(angle)*dist-30)+'px');
        target.appendChild(f);setTimeout(()=>f.remove(),1000);
    }
}

function spawnBubbles(target){
    if(!target)return;
    for(let i=0;i<12;i++){setTimeout(()=>{
        const b=document.createElement('div');b.className='reaction-bubble';
        b.style.left=(target.offsetWidth*0.2+Math.random()*target.offsetWidth*0.6)+'px';
        b.style.bottom='20px';
        b.style.width=(4+Math.random()*8)+'px';b.style.height=b.style.width;
        target.appendChild(b);setTimeout(()=>b.remove(),2000);
    },i*100);}
}

function spawnPrecipitate(target,color){
    if(!target)return;
    for(let i=0;i<10;i++){setTimeout(()=>{
        const p=document.createElement('div');p.className='precipitate-flake';
        p.style.left=(target.offsetWidth*0.15+Math.random()*target.offsetWidth*0.7)+'px';
        p.style.top=(target.offsetHeight*0.2)+'px';
        p.style.background=color;
        p.style.width=(3+Math.random()*5)+'px';p.style.height=p.style.width;
        target.appendChild(p);setTimeout(()=>p.remove(),3000);
    },i*150);}
}

function clearAll(){
    tableItems=[];flaskItems=[];
    renderTable();renderShelf();renderFlask();hideInfoCard();
    const eq=document.getElementById('chem-equation-box');
    if(eq){eq.classList.remove('visible');eq.innerHTML='';}
    const liq=document.querySelector('#chem-flask .flask-liquid');
    if(liq){liq.classList.remove('has-content','bubbling');liq.style.background='';liq.style.opacity='';}
    const tags=document.querySelector('#chem-flask .flask-tags');
    if(tags)tags.innerHTML='';
    const hint=document.getElementById('chem-hint');
    if(hint)hint.classList.remove('visible');
}

function addToHistory(r){
    history.unshift({eq:r.eq,name:r.name,type:r.type,danger:r.danger,xp:r.xp||10,ts:Date.now()});
    if(history.length>50)history.pop();
}

function renderHistory(){
    const list=document.getElementById('chem-hist-list');
    const valR=document.getElementById('chem-stat-total');
    const valU=document.getElementById('chem-stat-unique');
    if(valR)valR.textContent=totalReactions;
    if(valU)valU.textContent=discoveredReactions.size;
    if(!list)return;
    if(!history.length){list.innerHTML='<div class="history-empty-msg">🧪 Проведи первую реакцию!<br><small>Полка → Стол → Колба → Смешать!</small></div>';return;}
    list.innerHTML=history.slice(0,20).map((h,i)=>
        '<div class="hist-item" onclick="ChemLab.replayReaction('+i+')">'
        +'<div style="flex:1;min-width:0"><div class="hist-eq">'+h.eq.substring(0,50)+(h.eq.length>50?'…':'')+'</div><div class="hist-name">'+h.name+'</div></div>'
        +'<span class="hist-xp">+'+h.xp+'</span>'
        +(h.danger>=3?'<span class="hist-badge badge-danger">☠️</span>':'')
        +'</div>'
    ).join('');
}

function replayReaction(index){
    const h=history[index];if(!h)return;
    const reaction=REACTIONS.find(r=>r.name===h.name);
    if(reaction){tableItems=[...reaction.r];flaskItems=[...reaction.r];renderTable();renderShelf();renderFlask();setTimeout(()=>playReaction(reaction),400);}
}

function saveState(){
    try{localStorage.setItem('chemlab3',JSON.stringify({history,totalReactions,xp,level,achievements,discovered:[...discoveredReactions]}));}catch(e){}
}

function loadState(){
    try{
        const d=JSON.parse(localStorage.getItem('chemlab3'));
        if(d){history=d.history||[];totalReactions=d.totalReactions||0;xp=d.xp||0;level=d.level||1;achievements=d.achievements||[];discoveredReactions=new Set(d.discovered||[]);level=calcLevel();}
    }catch(e){}
}

function toast(msg){
    let t=document.getElementById('chem-toast');
    if(!t){t=document.createElement('div');t.id='chem-toast';t.style.cssText='position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:rgba(15,12,30,0.95);color:#fff;padding:12px 24px;border-radius:14px;font-size:14px;z-index:9999;pointer-events:none;opacity:0;transition:opacity 0.3s;border:1px solid rgba(108,92,231,0.3);backdrop-filter:blur(12px);max-width:90vw;text-align:center';document.body.appendChild(t);}
    t.textContent=msg;t.style.opacity='1';
    clearTimeout(t._timer);t._timer=setTimeout(()=>t.style.opacity='0',3500);
}

window.ChemLab={init,addToTable,removeFromTable,pourToFlask,filterCategory,mixReactants,clearAll,replayReaction,getHint:getRandomHint,getCount:()=>REACTIONS.length};

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else setTimeout(init,100);
})();

