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
    H2SO4:{id:'H2SO4',symbol:'H?SO?',name:'Серная кислота',cat:'acid',color:'#f0f0e0',rc:'бесцветная маслянистая'},
    HNO3:{id:'HNO3',symbol:'HNO?',name:'Азотная кислота',cat:'acid',color:'#fff8e0',rc:'бесц./желтоватая'},
    H3PO4:{id:'H3PO4',symbol:'H?PO?',name:'Фосфорная кислота',cat:'acid',color:'#f8f8f0',rc:'бесцветная'},
    CH3COOH:{id:'CH3COOH',symbol:'CH?COOH',name:'Уксусная кислота',cat:'acid',color:'#f8f8f0',rc:'бесцветная, резкий запах'},
    HF:{id:'HF',symbol:'HF',name:'Плавиковая кислота',cat:'acid',color:'#f0f0f0',rc:'бесцветная'},
    H2CO3:{id:'H2CO3',symbol:'H?CO?',name:'Угольная кислота',cat:'acid',color:'#e8f0f8',rc:'бесцветная (газировка)'},
    HBr:{id:'HBr',symbol:'HBr',name:'Бромоводородная к-та',cat:'acid',color:'#f0e8e0',rc:'бесцветная'},
    HCN:{id:'HCN',symbol:'HCN',name:'Синильная кислота',cat:'acid',color:'#f8f0f0',rc:'бесцветная, миндаль'},
    H2S:{id:'H2S',symbol:'H?S',name:'Сероводород',cat:'acid',color:'#f0f0d0',rc:'бесцветный газ, тухлый'},

    NaOH:{id:'NaOH',symbol:'NaOH',name:'Гидроксид натрия',cat:'base',color:'#ffffff',rc:'белые гранулы'},
    KOH:{id:'KOH',symbol:'KOH',name:'Гидроксид калия',cat:'base',color:'#ffffff',rc:'белые гранулы'},
    Ca_OH_2:{id:'Ca_OH_2',symbol:'Ca(OH)?',name:'Гидроксид кальция',cat:'base',color:'#f8f8f0',rc:'белый порошок'},
    Ba_OH_2:{id:'Ba_OH_2',symbol:'Ba(OH)?',name:'Гидроксид бария',cat:'base',color:'#f0f0f0',rc:'белые кристаллы'},
    NH4OH:{id:'NH4OH',symbol:'NH?OH',name:'Гидроксид аммония',cat:'base',color:'#f0f8f0',rc:'бесцветный р-р'},

    NaCl:{id:'NaCl',symbol:'NaCl',name:'Хлорид натрия',cat:'salt',color:'#ffffff',rc:'белые кристаллы'},
    KCl:{id:'KCl',symbol:'KCl',name:'Хлорид калия',cat:'salt',color:'#ffffff',rc:'белые кристаллы'},
    CaCO3:{id:'CaCO3',symbol:'CaCO?',name:'Карбонат кальция',cat:'salt',color:'#f8f8f0',rc:'белый (мрамор/мел)'},
    Na2CO3:{id:'Na2CO3',symbol:'Na?CO?',name:'Карбонат натрия',cat:'salt',color:'#ffffff',rc:'белый порошок'},
    NaHCO3:{id:'NaHCO3',symbol:'NaHCO?',name:'Сода пищевая',cat:'salt',color:'#ffffff',rc:'белый порошок'},
    CuSO4:{id:'CuSO4',symbol:'CuSO?',name:'Сульфат меди',cat:'salt',color:'#1E90FF',rc:'ярко-синие кристаллы'},
    FeCl3:{id:'FeCl3',symbol:'FeCl?',name:'Хлорид железа(III)',cat:'salt',color:'#8B4513',rc:'тёмно-коричневый'},
    AgNO3:{id:'AgNO3',symbol:'AgNO?',name:'Нитрат серебра',cat:'salt',color:'#f0f0f0',rc:'бесцветные кристаллы'},
    KMnO4:{id:'KMnO4',symbol:'KMnO?',name:'Перманганат калия',cat:'salt',color:'#800080',rc:'тёмно-фиолетовый'},
    BaCl2:{id:'BaCl2',symbol:'BaCl?',name:'Хлорид бария',cat:'salt',color:'#f0f0f0',rc:'белые кристаллы'},
    PbNO3_2:{id:'PbNO3_2',symbol:'Pb(NO?)?',name:'Нитрат свинца',cat:'salt',color:'#f0f0f0',rc:'белые кристаллы'},
    KI:{id:'KI',symbol:'KI',name:'Йодид калия',cat:'salt',color:'#f8f8f0',rc:'белые кристаллы'},
    FeSO4:{id:'FeSO4',symbol:'FeSO?',name:'Сульфат железа(II)',cat:'salt',color:'#90EE90',rc:'бледно-зелёные крист.'},
    ZnSO4:{id:'ZnSO4',symbol:'ZnSO?',name:'Сульфат цинка',cat:'salt',color:'#f0f0f0',rc:'бесцветные кристаллы'},
    CaCl2:{id:'CaCl2',symbol:'CaCl?',name:'Хлорид кальция',cat:'salt',color:'#f0f0f0',rc:'белые гранулы'},
    Na2S:{id:'Na2S',symbol:'Na?S',name:'Сульфид натрия',cat:'salt',color:'#f8f0e0',rc:'желтоватые кристаллы'},
    K2Cr2O7:{id:'K2Cr2O7',symbol:'K?Cr?O?',name:'Дихромат калия',cat:'salt',color:'#FF4500',rc:'ярко-оранжевые крист.'},
    NH4Cl:{id:'NH4Cl',symbol:'NH?Cl',name:'Хлорид аммония',cat:'salt',color:'#ffffff',rc:'белый порошок'},

    H2O:{id:'H2O',symbol:'H?O',name:'Вода',cat:'oxide',color:'#4fc3f7',rc:'бесцветная жидкость'},
    CO2:{id:'CO2',symbol:'CO?',name:'Углекислый газ',cat:'oxide',color:'#e0e8f0',rc:'бесцветный газ'},
    SO2:{id:'SO2',symbol:'SO?',name:'Сернистый газ',cat:'oxide',color:'#e8e8d0',rc:'бесцветный, резкий'},
    NO2:{id:'NO2',symbol:'NO?',name:'Диоксид азота',cat:'oxide',color:'#8B4513',rc:'бурый ядовитый газ'},
    CaO:{id:'CaO',symbol:'CaO',name:'Негашёная известь',cat:'oxide',color:'#f8f8f0',rc:'белые комки'},
    Na2O:{id:'Na2O',symbol:'Na?O',name:'Оксид натрия',cat:'oxide',color:'#ffffff',rc:'белый порошок'},
    Fe2O3:{id:'Fe2O3',symbol:'Fe?O?',name:'Оксид железа(III)',cat:'oxide',color:'#8B0000',rc:'бурый (ржавчина)'},
    Al2O3:{id:'Al2O3',symbol:'Al?O?',name:'Оксид алюминия',cat:'oxide',color:'#f0f0f0',rc:'белый порошок'},
    MnO2:{id:'MnO2',symbol:'MnO?',name:'Диоксид марганца',cat:'oxide',color:'#2d2d2d',rc:'чёрный порошок'},

    NH3:{id:'NH3',symbol:'NH?',name:'Аммиак',cat:'compound',color:'#e0f0e0',rc:'бесцветный газ, резкий'},
    H2O2:{id:'H2O2',symbol:'H?O?',name:'Перекись водорода',cat:'compound',color:'#e8f0ff',rc:'бесцветная жидкость'},
    C2H5OH:{id:'C2H5OH',symbol:'C?H?OH',name:'Этанол',cat:'organic',color:'#f8f0e0',rc:'бесцветная жидкость'},
    CH3OH:{id:'CH3OH',symbol:'CH?OH',name:'Метанол',cat:'organic',color:'#f0e8e0',rc:'бесцветная жидкость'},
    C6H12O6:{id:'C6H12O6',symbol:'C?H??O?',name:'Глюкоза',cat:'organic',color:'#ffffff',rc:'белые кристаллы'},
    C3H8:{id:'C3H8',symbol:'C?H?',name:'Пропан',cat:'organic',color:'#e8e8f0',rc:'бесцветный газ'},
    C6H6:{id:'C6H6',symbol:'C?H?',name:'Бензол',cat:'organic',color:'#f0f0e0',rc:'бесцветная жидкость'},
    CH4:{id:'CH4',symbol:'CH?',name:'Метан',cat:'organic',color:'#e8e8f0',rc:'бесцветный газ'},
    C2H2:{id:'C2H2',symbol:'C?H?',name:'Ацетилен',cat:'organic',color:'#f0f0e8',rc:'бесцветный газ'},

    phenol:{id:'phenol',symbol:'Фенолфт.',name:'Фенолфталеин',cat:'indicator',color:'#f0f0f0',rc:'бесцветный'},
    litmus:{id:'litmus',symbol:'Лакмус',name:'Лакмус',cat:'indicator',color:'#9370DB',rc:'фиолетовый'},
    methyl_o:{id:'methyl_o',symbol:'Мет.оранж',name:'Метилоранж',cat:'indicator',color:'#FFA500',rc:'оранжевый'}
};

const REACTIONS = [
    {r:['NaOH','HCl'],eq:'NaOH + HCl > NaCl + H?O',name:'Нейтрализация',type:'exo',energy:'-57 кДж/моль',rc:'#e8e8f0',anim:'heat',desc:'Щёлочь + кислота > соль + вода. Раствор нагревается!',med:'Принцип антацидов (Маалокс).',cond:'t° комнатная',products:['NaCl','H?O'],danger:0,xp:10},
    {r:['KOH','HCl'],eq:'KOH + HCl > KCl + H?O',name:'KOH + HCl',type:'exo',energy:'-57 кДж/моль',rc:'#e8e8f0',anim:'heat',desc:'Нейтрализация — раствор прозрачный, нагревается.',med:'KCl — препарат при гипокалиемии.',cond:'t° комнатная',products:['KCl','H?O'],danger:0,xp:10},
    {r:['NaOH','H2SO4'],eq:'2NaOH + H?SO? > Na?SO? + 2H?O',name:'NaOH + серная',type:'exo',energy:'-114 кДж/моль',rc:'#f0f0e8',anim:'boil',desc:'Сильный нагрев! Раствор кипит!',med:'Na?SO? (глауберова соль) — слабительное.',cond:'Осторожно!',products:['Na?SO?','H?O'],danger:1,xp:15},
    {r:['NaOH','HNO3'],eq:'NaOH + HNO? > NaNO? + H?O',name:'NaOH + азотная',type:'exo',energy:'-55 кДж/моль',rc:'#f0f0f0',anim:'heat',desc:'Нейтрализация. Прозрачный раствор.',med:'NaNO? — консервант (E251).',cond:'t° комнатная',products:['NaNO?','H?O'],danger:0,xp:10},
    {r:['Ca_OH_2','CO2'],eq:'Ca(OH)? + CO? > CaCO?v + H?O',name:'Помутнение известковой воды',type:'exo',energy:'-113 кДж/моль',rc:'#ffffff',anim:'precipitate',desc:'Раствор МУТНЕЕТ — белый осадок CaCO?!',med:'Качественная реакция на CO? в выдыхаемом воздухе.',cond:'t° комнатная',products:['CaCO?','H?O'],danger:0,xp:20},
    {r:['CH3COOH','NaOH'],eq:'CH?COOH + NaOH > CH?COONa + H?O',name:'Уксус + щёлочь',type:'exo',energy:'-56 кДж/моль',rc:'#f0f0f0',anim:'heat',desc:'Слабая кислота + сильная щёлочь > ацетат натрия.',med:'Ацетатные буферы в гемодиализе.',cond:'t° комнатная',products:['CH?COONa','H?O'],danger:0,xp:10},
    {r:['Ba_OH_2','H2SO4'],eq:'Ba(OH)? + H?SO? > BaSO?v + 2H?O',name:'Осадок BaSO?',type:'exo',energy:'-120 кДж/моль',rc:'#ffffff',anim:'precipitate',desc:'Белый тяжёлый осадок BaSO?!',med:'BaSO? — рентгеноконтраст для ЖКТ.',cond:'t° комнатная',products:['BaSO?','H?O'],danger:0,xp:20},

    {r:['Na','H2O'],eq:'2Na + 2H?O > 2NaOH + H?^',name:'Натрий в воде ??',type:'exo',energy:'-184 кДж/моль',rc:'#f0f0f0',anim:'explode',desc:'Натрий бегает по воде, ЗАГОРАЕТСЯ! Водород воспламеняется!',med:'Na — основной внеклет. катион. Физраствор.',cond:'ВЗРЫВООПАСНО!',products:['NaOH','H?'],danger:3,xp:50},
    {r:['K','H2O'],eq:'2K + 2H?O > 2KOH + H?^',name:'Калий в воде ????',type:'exo',energy:'-196 кДж/моль',rc:'#e0d0ff',anim:'explode',desc:'МГНОВЕННЫЙ ВЗРЫВ! Фиолетовое пламя калия!',med:'K — основной внутриклет. катион.',cond:'ВЗРЫВ!',products:['KOH','H?'],danger:4,xp:60},
    {r:['Li','H2O'],eq:'2Li + 2H?O > 2LiOH + H?^',name:'Литий в воде',type:'exo',energy:'-222 кДж/моль',rc:'#f0f0f0',anim:'bubble',desc:'Литий реагирует спокойнее — медленно пузырится.',med:'Li?CO? > лечение биполярного расстройства.',cond:'t° комнатная',products:['LiOH','H?'],danger:1,xp:25},
    {r:['Ca','H2O'],eq:'Ca + 2H?O > Ca(OH)? + H?^',name:'Кальций в воде',type:'exo',energy:'-414 кДж/моль',rc:'#f0f0e8',anim:'bubble',desc:'Кальций пузырится, раствор мутнеет.',med:'Ca(OH)? в стоматологии.',cond:'t° комнатная',products:['Ca(OH)?','H?'],danger:1,xp:25},

    {r:['Fe','HCl'],eq:'Fe + 2HCl > FeCl? + H?^',name:'Железо + HCl',type:'exo',energy:'-89 кДж/моль',rc:'#90b890',anim:'bubble',desc:'Железо растворяется, раствор ЗЕЛЕНЕЕТ (Fe??), пузырьки H?!',med:'Дефицит Fe > анемия.',cond:'t° комнатная',products:['FeCl?','H?'],danger:0,xp:15},
    {r:['Zn','HCl'],eq:'Zn + 2HCl > ZnCl? + H?^',name:'Цинк + HCl',type:'exo',energy:'-153 кДж/моль',rc:'#e8e8e8',anim:'bubble',desc:'Цинк активно растворяется — бурные пузырьки H?!',med:'Zn важен для иммунитета.',cond:'t° комнатная',products:['ZnCl?','H?'],danger:0,xp:15},
    {r:['Zn','H2SO4'],eq:'Zn + H?SO?(разб.) > ZnSO? + H?^',name:'Цинк + серная',type:'exo',energy:'-156 кДж/моль',rc:'#e8e8e8',anim:'bubble',desc:'Растворение с пузырьками водорода.',med:'ZnSO? в глазных каплях.',cond:'Разбавленная',products:['ZnSO?','H?'],danger:0,xp:15},
    {r:['Mg','HCl'],eq:'Mg + 2HCl > MgCl? + H?^',name:'Магний + HCl',type:'exo',energy:'-462 кДж/моль',rc:'#e8e8e8',anim:'boil',desc:'Магний БУРНО реагирует! Интенсивные пузырьки!',med:'Магнезия — спазмолитик.',cond:'t° комнатная',products:['MgCl?','H?'],danger:1,xp:20},
    {r:['Al','HCl'],eq:'2Al + 6HCl > 2AlCl? + 3H?^',name:'Алюминий + HCl',type:'exo',energy:'-1049 кДж/моль',rc:'#e8e8e8',anim:'bubble',desc:'Сначала медленно (плёнка), затем бурно!',med:'Al(OH)? — антациды (Алмагель).',cond:'t° комнатная',products:['AlCl?','H?'],danger:1,xp:20},
    {r:['Cu','HNO3'],eq:'3Cu + 8HNO? > 3Cu(NO?)? + 2NO^ + 4H?O',name:'Медь + азотная ??',type:'exo',energy:'-156 кДж/моль',rc:'#1E90FF',anim:'smoke',desc:'Медь > ярко-СИНИЙ раствор Cu??! Бурый ядовитый газ NO?!',med:'Cu важна для ферментов.',cond:'ЯДОВИТЫЙ ГАЗ!',products:['Cu(NO?)?','NO','H?O'],danger:3,xp:40},
    {r:['Au','HNO3'],eq:'Au + HNO? > НЕ РЕАГИРУЕТ',name:'Золото + HNO? ?',type:'neutral',energy:'0',rc:'#FFD700',anim:'none',desc:'Золото НЕ растворяется! Нужна «царская водка» (HCl+HNO?)!',med:'Au > ауротерапия (ревм. артрит).',cond:'Не реагирует',products:['Au'],danger:0,xp:15},

    {r:['CaCO3','HCl'],eq:'CaCO? + 2HCl > CaCl? + H?O + CO?^',name:'Мрамор + кислота ??',type:'exo',energy:'-24 кДж/моль',rc:'#e8f0f8',anim:'fizz',desc:'Мрамор шипит — фонтан пузырьков CO?!',med:'CaCO? — антацид (Ренни).',cond:'Любая t°',products:['CaCl?','H?O','CO?'],danger:0,xp:15},
    {r:['Na2CO3','HCl'],eq:'Na?CO? + 2HCl > 2NaCl + H?O + CO?^',name:'Сода + кислота ??',type:'exo',energy:'-26 кДж/моль',rc:'#e8e8f0',anim:'fizz',desc:'«Вулкан» — бурное выделение CO?!',med:'Сода для коррекции ацидоза.',cond:'t° комнатная',products:['NaCl','H?O','CO?'],danger:0,xp:15},
    {r:['NaHCO3','HCl'],eq:'NaHCO? + HCl > NaCl + H?O + CO?^',name:'Пищевая сода + HCl ??',type:'exo',energy:'-12 кДж/моль',rc:'#f0f0f0',anim:'fizz',desc:'Бурные пузырьки CO?!',med:'Сода — антацид при изжоге.',cond:'t° комнатная',products:['NaCl','H?O','CO?'],danger:0,xp:10},
    {r:['NaHCO3','CH3COOH'],eq:'NaHCO? + CH?COOH > CH?COONa + H?O + CO?^',name:'Сода + уксус ??',type:'exo',energy:'-10 кДж/моль',rc:'#f0f0e8',anim:'fizz',desc:'Самый знаменитый «вулкан»! Фонтан пены!',med:'Безопасная домашняя реакция.',cond:'t° комнатная',products:['CH?COONa','H?O','CO?'],danger:0,xp:10},
    {r:['CaCO3','CH3COOH'],eq:'CaCO? + 2CH?COOH > Ca(CH?COO)? + H?O + CO?^',name:'Скорлупа + уксус',type:'exo',energy:'-15 кДж/моль',rc:'#f0f0e8',anim:'fizz',desc:'Яичная скорлупа растворяется с пузырьками!',med:'Уксусная кислота — антисептик.',cond:'t° комнатная',products:['Ca(CH?COO)?','H?O','CO?'],danger:0,xp:15},

    {r:['AgNO3','NaCl'],eq:'AgNO? + NaCl > AgClv + NaNO?',name:'Белый осадок AgCl',type:'neutral',energy:'-65 кДж/моль',rc:'#ffffff',anim:'precipitate',desc:'БЕЛЫЙ ТВОРОЖИСТЫЙ осадок! Качественная на Cl?.',med:'Определение хлоридов в моче.',cond:'t° комнатная',products:['AgCl','NaNO?'],danger:0,xp:20},
    {r:['BaCl2','H2SO4'],eq:'BaCl? + H?SO? > BaSO?v + 2HCl',name:'Белый осадок BaSO?',type:'neutral',energy:'-50 кДж/моль',rc:'#ffffff',anim:'precipitate',desc:'БЕЛЫЙ нерастворимый осадок. Качественная на SO???.',med:'BaSO? — рентгеноконтраст.',cond:'t° комнатная',products:['BaSO?','HCl'],danger:0,xp:20},
    {r:['FeCl3','NaOH'],eq:'FeCl? + 3NaOH > Fe(OH)?v + 3NaCl',name:'БУРЫЙ осадок Fe(OH)? ??',type:'neutral',energy:'-72 кДж/моль',rc:'#8B4513',anim:'precipitate',desc:'РЫЖЕ-БУРЫЙ осадок! Реакция на Fe??!',med:'Fe(OH)? — антидот при отравлении мышьяком!',cond:'t° комнатная',products:['Fe(OH)?','NaCl'],danger:0,xp:25},
    {r:['CuSO4','NaOH'],eq:'CuSO? + 2NaOH > Cu(OH)?v + Na?SO?',name:'ГОЛУБОЙ осадок Cu(OH)? ??',type:'neutral',energy:'-63 кДж/моль',rc:'#4169E1',anim:'precipitate',desc:'НЕЖНО-ГОЛУБОЙ гелеобразный осадок! Красота!',med:'Биуретовая реакция на белки!',cond:'t° комнатная',products:['Cu(OH)?','Na?SO?'],danger:0,xp:25},
    {r:['AgNO3','KI'],eq:'AgNO? + KI > AgIv + KNO?',name:'ЖЁЛТЫЙ осадок AgI ??',type:'neutral',energy:'-62 кДж/моль',rc:'#FFD700',anim:'precipitate',desc:'ЯРКО-ЖЁЛТЫЙ осадок иодида серебра!',med:'AgI — рентгенографические плёнки.',cond:'t° комнатная',products:['AgI','KNO?'],danger:0,xp:25},
    {r:['PbNO3_2','KI'],eq:'Pb(NO?)? + 2KI > PbI?v + 2KNO?',name:'«Золотой дождь» ?',type:'neutral',energy:'-98 кДж/моль',rc:'#FFD700',anim:'golden',desc:'КРАСИВЕЙШАЯ реакция! Золотые кристаллы!',med:'?? Свинец ТОКСИЧЕН!',cond:'горячий > охлаждение',products:['PbI?','KNO?'],danger:2,xp:40},
    {r:['Na2S','PbNO3_2'],eq:'Na?S + Pb(NO?)? > PbSv + 2NaNO?',name:'ЧЁРНЫЙ осадок PbS ?',type:'neutral',energy:'-85 кДж/моль',rc:'#1a1a1a',anim:'precipitate',desc:'ЧЁРНЫЙ осадок!',med:'Реакция на свинец в биожидкостях.',cond:'t° комнатная',products:['PbS','NaNO?'],danger:2,xp:30},

    {r:['Cu','AgNO3'],eq:'Cu + 2AgNO? > Cu(NO?)? + 2Agv',name:'Дерево серебра ??',type:'exo',energy:'-148 кДж/моль',rc:'#87CEEB',anim:'crystals',desc:'На меди «иголки» серебра! Раствор голубеет!',med:'AgNO? (ляпис) — антисептик.',cond:'t° комнатная',products:['Cu(NO?)?','Ag'],danger:0,xp:30},
    {r:['Fe','CuSO4'],eq:'Fe + CuSO? > FeSO? + Cuv',name:'Красная медь на железе',type:'exo',energy:'-153 кДж/моль',rc:'#90EE90',anim:'coat',desc:'На гвозде — КРАСНЫЙ налёт меди! Раствор зеленеет!',med:'Болезнь Вильсона — нарушение обмена Cu.',cond:'t° комнатная',products:['FeSO?','Cu'],danger:0,xp:25},
    {r:['Zn','CuSO4'],eq:'Zn + CuSO? > ZnSO? + Cuv',name:'Цинк > медь',type:'exo',energy:'-218 кДж/моль',rc:'#e0e8e0',anim:'coat',desc:'Красный налёт Cu на цинке. Раствор обесцвечивается!',med:'Zn и Cu — микроэлементы.',cond:'t° комнатная',products:['ZnSO?','Cu'],danger:0,xp:25},

    {r:['H','O'],eq:'2H? + O? > 2H?O',name:'Гремучий газ ????',type:'exo',energy:'-572 кДж/моль',rc:'#a8d8ff',anim:'explode',desc:'ГРЕМУЧИЙ ГАЗ! H?+O? > мощный ВЗРЫВ!',med:'Вода — 60% массы человека.',cond:'t° > 500°C',products:['H?O'],danger:4,xp:50},
    {r:['C','O'],eq:'C + O? > CO?',name:'Горение углерода',type:'exo',energy:'-393 кДж/моль',rc:'#e0e0e0',anim:'burn',desc:'Углерод горит, образуя CO?.',med:'CO? — конечный продукт дыхания.',cond:'Поджиг',products:['CO?'],danger:1,xp:15},
    {r:['S','O'],eq:'S + O? > SO?',name:'Голубое пламя серы ??',type:'exo',energy:'-297 кДж/моль',rc:'#6495ED',anim:'burn',desc:'Сера горит ГОЛУБЫМ пламенем! Резкий запах!',med:'SO? — Е220 (консервант).',cond:'Поджиг',products:['SO?'],danger:2,xp:25},
    {r:['Fe','O'],eq:'4Fe + 3O? > 2Fe?O?',name:'Горение железа ??',type:'exo',energy:'-1648 кДж/моль',rc:'#8B0000',anim:'sparks',desc:'В чистом O? железо ГОРИТ яркими ИСКРАМИ!',med:'Fe в гемоглобине > транспорт O?.',cond:'В чистом O?',products:['Fe?O?'],danger:2,xp:30},
    {r:['Mg','O'],eq:'2Mg + O? > 2MgO',name:'Ослепительная вспышка ??',type:'exo',energy:'-1204 кДж/моль',rc:'#ffffff',anim:'flash',desc:'ОСЛЕПИТЕЛЬНЫЙ белый свет! НЕ смотреть!',med:'MgO — антацид. Mg — 600+ ферментов.',cond:'Поджиг',products:['MgO'],danger:3,xp:40},
    {r:['P','O'],eq:'4P + 5O? > 2P?O?',name:'Фосфор горит ????',type:'exo',energy:'-3010 кДж/моль',rc:'#fffde8',anim:'burn',desc:'Белый фосфор САМОВОСПЛАМЕНЯЕТСЯ!',med:'Фосфорные ожоги — тяжелейшие!',cond:'t° > 34°C',products:['P?O?'],danger:5,xp:60},
    {r:['CH4','O'],eq:'CH? + 2O? > CO? + 2H?O',name:'Горение метана ??',type:'exo',energy:'-890 кДж/моль',rc:'#a0c0ff',anim:'burn',desc:'Природный газ > синее пламя. Утечка > ВЗРЫВ!',med:'Метан > асфиксия.',cond:'Поджиг',products:['CO?','H?O'],danger:3,xp:35},
    {r:['C2H2','O'],eq:'2C?H? + 5O? > 4CO? + 2H?O',name:'Горение ацетилена ??',type:'exo',energy:'-2600 кДж/моль',rc:'#FFD700',anim:'burn',desc:'Яркое коптящее пламя! Сварка (3000°C)!',med:'Ацетилен ВЗРЫВООПАСЕН!',cond:'Поджиг',products:['CO?','H?O'],danger:4,xp:45},
    {r:['C2H5OH','O'],eq:'C?H?OH + 3O? > 2CO? + 3H?O',name:'Горение спирта ??',type:'exo',energy:'-1367 кДж/моль',rc:'#a8c0ff',anim:'burn',desc:'Почти невидимое голубоватое пламя!',med:'70% этанол — антисептик.',cond:'Поджиг',products:['CO?','H?O'],danger:2,xp:25},
    {r:['C3H8','O'],eq:'C?H? + 5O? > 3CO? + 4H?O',name:'Горение пропана ??',type:'exo',energy:'-2220 кДж/моль',rc:'#ffe0a0',anim:'explode',desc:'Газовый баллон! Утечка > ВЗРЫВ!',med:'Ожоги пропаном — частая травма.',cond:'Поджиг',products:['CO?','H?O'],danger:4,xp:45},

    {r:['N','H'],eq:'N? + 3H? ? 2NH?',name:'Синтез аммиака (Габер)',type:'exo',energy:'-92 кДж/моль',rc:'#e0ffe0',anim:'heat',desc:'Важнейшая промышленная реакция! Fe, 450°C, 200 атм.',med:'NH? > мочевина. Печ. недостаточность.',cond:'450°C, 200 атм',products:['NH?'],danger:1,xp:35},
    {r:['Na','Cl'],eq:'2Na + Cl? > 2NaCl',name:'Натрий + хлор ????',type:'exo',energy:'-822 кДж/моль',rc:'#ffffff',anim:'explode',desc:'ЯРКАЯ вспышка! Натрий ГОРИТ в хлоре > поваренная соль!',med:'NaCl 0.9% — физраствор.',cond:'Поджиг',products:['NaCl'],danger:4,xp:50},
    {r:['Fe','S'],eq:'Fe + S > FeS',name:'Железо + сера',type:'exo',energy:'-100 кДж/моль',rc:'#4a4a30',anim:'burn',desc:'Смесь порошков > вспышка! Сульфид железа.',med:'H?S — регулятор тонуса сосудов.',cond:'Нагрев',products:['FeS'],danger:1,xp:20},
    {r:['CaO','H2O'],eq:'CaO + H?O > Ca(OH)?',name:'Гашение извести ??',type:'exo',energy:'-65 кДж/моль',rc:'#f8f8f0',anim:'boil',desc:'Негашёная известь + вода = СИЛЬНЫЙ нагрев! Пар, кипение!',med:'Ca(OH)? в стоматологии.',cond:'t° комнатная',products:['Ca(OH)?'],danger:2,xp:25},

    {r:['H2O2','MnO2'],eq:'2H?O? > 2H?O + O?^ (кат. MnO?)',name:'«Зубная паста слона» ??',type:'exo',energy:'-196 кДж',rc:'#e8f0ff',anim:'foam',desc:'Перекись БУРНО разлагается! Пена, кислород!',med:'H?O? 3% — антисептик для ран.',cond:'Кат. MnO?',products:['H?O','O?'],danger:1,xp:25},
    {r:['KMnO4','H2SO4'],eq:'2KMnO? + H?SO? > Mn?O? + K?SO? + H?O',name:'Марганцовка + серная ????',type:'exo',energy:'-312 кДж',rc:'#4B0082',anim:'explode',desc:'КРАЙНЕ ОПАСНО! Mn?O? может ВЗОРВАТЬСЯ!',med:'KMnO? (марганцовка) — антисептик.',cond:'Конц. H?SO?',products:['Mn?O?','K?SO?','H?O'],danger:5,xp:70},
    {r:['Al','Fe2O3'],eq:'2Al + Fe?O? > Al?O? + 2Fe',name:'ТЕРМИТ ??????',type:'exo',energy:'-852 кДж/моль',rc:'#FF4500',anim:'thermite',desc:'t° > 2500°C! РАСПЛАВЛЕННОЕ железо! Горит под водой!',med:'Ожоги термитом — катастрофические.',cond:'Mg как запал',products:['Al?O?','Fe'],danger:5,xp:80},
    {r:['H2O2','KMnO4'],eq:'5H?O? + 2KMnO? > 5O?^ + 2MnO? + 2KOH + 3H?O',name:'Перекись + марганцовка',type:'exo',energy:'-196 кДж',rc:'#DDA0DD',anim:'foam',desc:'Фиолетовый > обесцвечивается! Бурный O?!',med:'Оба — антисептики.',cond:'t° комнатная',products:['O?','MnO?','KOH','H?O'],danger:1,xp:25},
    {r:['NH3','HCl'],eq:'NH? + HCl > NH?Cl',name:'«Дым без огня» ??',type:'exo',energy:'-176 кДж/моль',rc:'#f0f0f0',anim:'smoke',desc:'Белый «дым» (аэрозоль NH?Cl)!',med:'Нашатырный спирт при обмороках.',cond:'Газовая фаза',products:['NH?Cl'],danger:1,xp:25},

    {r:['Na','C2H5OH'],eq:'2C?H?OH + 2Na > 2C?H?ONa + H?^',name:'Натрий + этанол',type:'exo',energy:'-90 кДж/моль',rc:'#f0e8d8',anim:'bubble',desc:'Натрий медленно реагирует с этанолом.',med:'Этилат натрия — реагент.',cond:'t° комнатная',products:['C?H?ONa','H?'],danger:2,xp:30},
    {r:['HCN','NaOH'],eq:'HCN + NaOH > NaCN + H?O',name:'Синильная кислота + NaOH ??',type:'exo',energy:'-42 кДж/моль',rc:'#f0f0e8',anim:'toxic',desc:'СИНИЛЬНАЯ КИСЛОТА — СМЕРТЕЛЬНА!',med:'HCN блокирует цитохромоксидазу. Антидот: амилнитрит.',cond:'t° комнатная',products:['NaCN','H?O'],danger:5,xp:60},
    {r:['Hg','HNO3'],eq:'3Hg + 8HNO? > 3Hg(NO?)? + 2NO^ + 4H?O',name:'Ртуть + азотная ??',type:'exo',energy:'-140 кДж/моль',rc:'#c0c0c0',anim:'toxic',desc:'Пары ртути КРАЙНЕ ЯДОВИТЫ!',med:'Отравление ртутью. Антидот — унитиол.',cond:'t° комнатная',products:['Hg(NO?)?','NO','H?O'],danger:5,xp:60},
    {r:['K2Cr2O7','H2SO4'],eq:'K?Cr?O? + H?SO? > хромовая смесь ??',name:'Хромовая смесь ??',type:'exo',energy:'-200 кДж',rc:'#FF4500',anim:'toxic',desc:'Мощнейший ОКИСЛИТЕЛЬ! Cr?? — канцероген!',med:'Хром(VI) > рак лёгких.',cond:'Конц. H?SO?',products:['CrO?','K?SO?','H?O'],danger:5,xp:60},
    {r:['C6H6','Br'],eq:'C?H? + Br? > C?H?Br + HBr',name:'Бромирование бензола',type:'exo',energy:'-50 кДж/моль',rc:'#DEB887',anim:'smoke',desc:'Замещение H на Br. Бром — ЕДКИЙ!',med:'Бром вызывает ожоги.',cond:'Кат. FeBr?',products:['C?H?Br','HBr'],danger:3,xp:35},

    {r:['C6H12O6','O'],eq:'C?H??O? + 6O? > 6CO? + 6H?O',name:'Клеточное дыхание ??',type:'exo',energy:'-2803 кДж/моль',rc:'#e8e0d0',anim:'glow',desc:'КЛЕТОЧНОЕ ДЫХАНИЕ! Энергия жизни!',med:'Глюкоза 5% — р-р для капельниц. Диабет.',cond:'Ферменты, 37°C',products:['CO?','H?O'],danger:0,xp:30},
    {r:['FeSO4','KMnO4'],eq:'10FeSO? + 2KMnO? + 8H?SO? > ...',name:'Перманганатометрия',type:'exo',energy:'-500 кДж',rc:'#90EE90',anim:'decolor',desc:'Фиолетовый KMnO? ОБЕСЦВЕЧИВАЕТСЯ! Титрование.',med:'Определение Fe?? в крови.',cond:'Кислая среда',products:['Fe?(SO?)?','MnSO?'],danger:0,xp:30},

    {r:['phenol','NaOH'],eq:'Фенолфталеин в щёлочи > МАЛИНОВЫЙ',name:'Малиновый цвет! ??',type:'neutral',energy:'0',rc:'#FF1493',anim:'color',desc:'Бесцветный > ЯРКИЙ МАЛИНОВЫЙ! pH > 8.2',med:'Фенолфталеин (пурген) — слабительное.',cond:'pH > 8.2',products:['Малиновый р-р'],danger:0,xp:20},
    {r:['litmus','HCl'],eq:'Лакмус + кислота > КРАСНЫЙ',name:'Лакмус краснеет! ??',type:'neutral',energy:'0',rc:'#DC143C',anim:'color',desc:'Фиолетовый > КРАСНЫЙ в кислоте!',med:'Экспресс-определение pH.',cond:'pH < 5',products:['Красный р-р'],danger:0,xp:15},
    {r:['litmus','NaOH'],eq:'Лакмус + щёлочь > СИНИЙ',name:'Лакмус синеет! ??',type:'neutral',energy:'0',rc:'#0000CD',anim:'color',desc:'Фиолетовый > СИНИЙ в щёлочи!',med:'Определение pH мочи, слюны.',cond:'pH > 8',products:['Синий р-р'],danger:0,xp:15},
    {r:['methyl_o','HCl'],eq:'Метилоранж + кислота > КРАСНЫЙ',name:'Метилоранж краснеет!',type:'neutral',energy:'0',rc:'#FF4500',anim:'color',desc:'Оранжевый > КРАСНЫЙ в кислоте!',med:'Титрование лекарственных р-ров.',cond:'pH < 3.1',products:['Красный р-р'],danger:0,xp:15},

    {r:['H2S','FeCl3'],eq:'H?S + 2FeCl? > Sv + 2FeCl? + 2HCl',name:'Сера выпадает!',type:'exo',energy:'-80 кДж/моль',rc:'#FFFF00',anim:'precipitate',desc:'ЖЁЛТЫЙ осадок серы! H?S — тухлые яйца!',med:'H?S — газотрансмиттер.',cond:'t° комнатная',products:['S','FeCl?','HCl'],danger:3,xp:30},
    {r:['Na2O','H2O'],eq:'Na?O + H?O > 2NaOH',name:'Оксид натрия + вода',type:'exo',energy:'-146 кДж/моль',rc:'#f0f0f8',anim:'boil',desc:'Оксид + вода > щёлочь! Сильный нагрев!',med:'NaOH разъедает кожу!',cond:'t° комнатная',products:['NaOH'],danger:2,xp:20},
    {r:['SO2','H2O'],eq:'SO? + H?O > H?SO?',name:'Кислотный дождь ?',type:'exo',energy:'-42 кДж/моль',rc:'#e8e8d0',anim:'heat',desc:'Причина кислотных дождей!',med:'SO? > бронхоспазм у астматиков.',cond:'t° комнатная',products:['H?SO?'],danger:2,xp:20},
    {r:['CO2','H2O'],eq:'CO? + H?O ? H?CO?',name:'Газировка! ??',type:'neutral',energy:'-20 кДж/моль',rc:'#e0f0ff',anim:'fizz',desc:'Газированная вода! CO? + H?O > угольная кислота.',med:'Бикарбонатный буфер крови.',cond:'t° комнатная',products:['H?CO?'],danger:0,xp:10},
    {r:['NH4Cl','NaOH'],eq:'NH?Cl + NaOH > NaCl + NH?^ + H?O',name:'Аммиак выделяется!',type:'endo',energy:'+16 кДж/моль',rc:'#e0ffe0',anim:'smoke',desc:'Резкий запах NH?! Лакмус синеет от паров!',med:'Нашатырный спирт > пробуждение.',cond:'Нагрев',products:['NaCl','NH?','H?O'],danger:1,xp:20}
];

let tableItems=[], flaskItems=[], history=[], totalReactions=0;
let xp=0, level=1, combo=0, comboTimer=null;
let discoveredReactions=new Set(), achievements=[];
let activeCategory='all', searchQuery='';

const ACHIEVEMENTS_LIST=[
    {id:'first',icon:'??',name:'Первая реакция',desc:'Проведи первую реакцию',check:()=>totalReactions>=1},
    {id:'five',icon:'??',name:'Начинающий химик',desc:'Проведи 5 реакций',check:()=>totalReactions>=5},
    {id:'ten',icon:'??',name:'Лаборант',desc:'Проведи 10 реакций',check:()=>totalReactions>=10},
    {id:'twenty',icon:'?????',name:'Учёный',desc:'Проведи 20 реакций',check:()=>totalReactions>=20},
    {id:'fifty',icon:'??',name:'Профессор химии',desc:'Проведи 50 реакций',check:()=>totalReactions>=50},
    {id:'disc5',icon:'???',name:'Исследователь',desc:'Открой 5 уникальных реакций',check:()=>discoveredReactions.size>=5},
    {id:'disc15',icon:'??',name:'Энциклопедист',desc:'Открой 15 уникальных реакций',check:()=>discoveredReactions.size>=15},
    {id:'disc30',icon:'??',name:'Мастер реакций',desc:'Открой 30 уникальных реакций',check:()=>discoveredReactions.size>=30},
    {id:'danger',icon:'??',name:'Смельчак',desc:'Проведи опасную реакцию',check:()=>history.some(h=>h.danger>=3)},
    {id:'deadly',icon:'??',name:'Безумный учёный',desc:'Проведи смертельную реакцию',check:()=>history.some(h=>h.danger>=5)},
    {id:'combo3',icon:'??',name:'Комбо x3',desc:'Сделай 3 реакции подряд',check:()=>combo>=3},
    {id:'combo5',icon:'??',name:'Комбо x5',desc:'Сделай 5 реакций подряд',check:()=>combo>=5},
    {id:'lvl5',icon:'?',name:'Уровень 5',desc:'Достигни 5 уровня',check:()=>level>=5},
    {id:'lvl10',icon:'??',name:'Уровень 10',desc:'Достигни 10 уровня',check:()=>level>=10},
    {id:'indicator',icon:'??',name:'Колорист',desc:'Проведи индикаторную реакцию',check:()=>history.some(h=>h.name.includes('Лакмус')||h.name.includes('Малинов')||h.name.includes('Метилоранж'))}
];

const CATEGORIES=[
    {key:'all',label:'?? Все'},{key:'nonmetal',label:'Неметаллы'},{key:'alkali',label:'?? Щелочные'},
    {key:'alkaline',label:'Щёл.зем.'},{key:'transition',label:'?? Переходные'},{key:'metal',label:'Металлы'},
    {key:'halogen',label:'Галогены'},{key:'noble',label:'Благородные'},{key:'acid',label:'?? Кислоты'},
    {key:'base',label:'Основания'},{key:'salt',label:'?? Соли'},{key:'oxide',label:'Оксиды'},
    {key:'organic',label:'?? Органика'},{key:'compound',label:'Вещества'},{key:'indicator',label:'?? Индикаторы'}
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
    console.log('? ChemLab v3 GAME: '+REACTIONS.length+' reactions, '+Object.keys(SUBSTANCES).length+' substances');
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
    if(!filtered.length){c.innerHTML='<div style="grid-column:1/-1;text-align:center;color:rgba(255,255,255,0.3);padding:30px">?? Ничего не найдено</div>';return;}
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
    if(tableItems.length>=5){toast('?? Макс 5 веществ на столе');return;}
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
    if(!tableItems.length){c.innerHTML='<div class="table-empty">Нажми на вещество на полке ??</div>';return;}
    c.innerHTML=tableItems.map(id=>{
        const s=SUBSTANCES[id];if(!s)return'';
        const inF=flaskItems.includes(id);
        return '<div class="table-substance'+(inF?' in-flask':'')+'" onclick="ChemLab.pourToFlask(\''+id+'\')">'
            +'<span class="sub-symbol" style="background:'+s.color+';color:'+(isLight(s.color)?'#222':'#fff')+'">'+s.symbol+'</span>'
            +'<span class="sub-name">'+s.name+'</span>'
            +'<div class="sub-remove" onclick="event.stopPropagation();ChemLab.removeFromTable(\''+id+'\')">?</div>'
            +'</div>';
    }).join('');
}

function pourToFlask(id){
    if(flaskItems.includes(id)){flaskItems=flaskItems.filter(x=>x!==id);}
    else{if(flaskItems.length>=3){toast('?? Макс 3 вещества в колбе');return;}flaskItems.push(id);}
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
                    if(h){h.innerHTML='?? <strong>'+SUBSTANCES[tableItems[i]]?.name+'</strong> + <strong>'+SUBSTANCES[tableItems[j]]?.name+'</strong> — можно смешать!';h.classList.add('visible');setTimeout(()=>h.classList.remove('visible'),5000);}
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
    toast('?? Подсказка: смешай '+(SUBSTANCES[r.r[0]]?.name||r.r[0])+' и '+(SUBSTANCES[r.r[1]]?.name||r.r[1])+'!');
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

    // ========== 3D РЕАЛИСТИЧНЫЕ ЭФФЕКТЫ ==========
    const anim=reaction.anim||'heat';
    flask?.classList.add('flask-3d-active');
    setTimeout(()=>flask?.classList.remove('flask-3d-active'),3000);

    switch(anim){
        case 'explode':
            createScreenFlash(reaction.danger>=4?'rgba(255,80,0,0.8)':'rgba(255,240,180,0.7)',500);
            zone?.classList.add('shake-heavy');setTimeout(()=>zone?.classList.remove('shake-heavy'),1000);
            createShockwave(flask);createFireball(flask,80);createEmbers(flask,30);
            createDebris(flask,reaction.rc);spawnSmoke(flask,10);spawnParticles(flask,reaction,40);
            break;
        case 'thermite':
            createScreenFlash('rgba(255,60,0,0.9)',700);
            zone?.classList.add('shake-heavy');setTimeout(()=>zone?.classList.remove('shake-heavy'),1200);
            createShockwave(flask);createFireball(flask,110);createEmbers(flask,40);
            createMoltenDrips(flask,'#FF4500');createFlameColumn(flask);createHeatShimmer(flask);
            spawnSmoke(flask,12);spawnParticles(flask,reaction,50);
            break;
        case 'flash':
            createScreenFlash('rgba(255,255,255,0.95)',800);
            createSparksSpray(flask,35,'#ffffff');createEmbers(flask,20);spawnParticles(flask,reaction,25);
            break;
        case 'burn':
            createFlameColumn(flask);createEmbers(flask,20);createHeatShimmer(flask);
            spawnSmoke(flask,4);spawnParticles(flask,reaction,20);
            break;
        case 'sparks':
            createSparksSpray(flask,35,'#ffbe76');createEmbers(flask,25);
            createFlameColumn(flask);spawnParticles(flask,reaction,15);
            break;
        case 'smoke':
            spawnSmoke(flask,10);spawnParticles(flask,reaction,15);
            break;
        case 'toxic':
            createToxicCloud(flask);spawnSmoke(flask,6);
            createScreenFlash('rgba(0,255,0,0.15)',400);
            break;
        case 'fizz':
            spawnBubbles(flask,30,true);spawnParticles(flask,reaction,12);
            break;
        case 'foam':
            createFoamEffect(flask);spawnBubbles(flask,25,true);spawnParticles(flask,reaction,10);
            break;
        case 'boil':
            spawnBubbles(flask,25,false);createHeatShimmer(flask);
            spawnSmoke(flask,3);spawnParticles(flask,reaction,15);
            break;
        case 'precipitate':
            spawnPrecipitate(flask,reaction.rc,18);createColorWave(flask,reaction.rc);
            spawnParticles(flask,reaction,10);
            break;
        case 'golden':
            createGoldenRain(flask);spawnPrecipitate(flask,'#FFD700',12);
            createScreenFlash('rgba(255,215,0,0.3)',400);spawnParticles(flask,reaction,15);
            break;
        case 'color':
            createColorWave(flask,reaction.rc);spawnParticles(flask,reaction,15);
            break;
        case 'crystals': case 'coat':
            createSparksSpray(flask,18,reaction.rc);spawnParticles(flask,reaction,12);
            break;
        case 'decolor': case 'glow':
            createColorWave(flask,reaction.rc);spawnParticles(flask,reaction,10);
            break;
        default:
            if(anim==='heat')createHeatShimmer(flask);
            spawnParticles(flask,reaction,15);
    }

    setTimeout(()=>{
        const liquid=document.querySelector('#chem-flask .flask-liquid');
        if(liquid){liquid.style.transition='background 1.2s ease, opacity 0.6s ease';
            liquid.style.background=reaction.rc;liquid.style.opacity='1';
            liquid.classList.add('bubbling');setTimeout(()=>liquid.classList.remove('bubbling'),4000);}
        if(flask){flask.style.setProperty('--glow-color',reaction.danger>=3?'rgba(255,71,87,0.6)':reaction.rc+'88');
            flask.classList.add('flask-glow');setTimeout(()=>flask.classList.remove('flask-glow'),4000);}
    },400);

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
    if(eqBox){eqBox.innerHTML='<span style="color:rgba(255,255,255,0.4)">? '+names+' — реакция не идёт</span>';eqBox.classList.add('visible');}
    hideInfoCard();combo=0;renderGameBar();
    toast('Эти вещества не реагируют ?? Попробуй другие!');
}

function showXpPopup(amount,isNew,currentCombo){
    const p=document.createElement('div');p.className='xp-popup';
    let t='+'+amount+' XP';if(isNew)t+=' ??';if(currentCombo>=3)t+=' (x'+currentCombo+' комбо!)';
    p.textContent=t;document.body.appendChild(p);
    requestAnimationFrame(()=>p.classList.add('show'));
    setTimeout(()=>{p.classList.remove('show');setTimeout(()=>p.remove(),300);},2000);
}

function showLevelUp(newLevel){
    const o=document.createElement('div');o.className='level-up-overlay';
    o.innerHTML='<div class="level-up-card"><div class="level-up-icon">?</div><h3>УРОВЕНЬ '+newLevel+'!</h3><p>Ты становишься настоящим химиком!</p></div>';
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
    const tl=r.type==='exo'?'?? Экзотермическая':r.type==='endo'?'?? Эндотермическая':'?? Обменная';
    const db='??'.repeat(Math.min(r.danger,5));
    card.innerHTML='<div class="info-card-header"><h4>'+r.name+'</h4><span class="reaction-badge badge-'+r.type+'">'+tl+'</span>'
        +(r.danger>=3?'<span class="reaction-badge badge-danger">?? ОПАСНО</span>':'')+'</div>'
        +'<div class="info-card-body"><div class="info-details-grid">'
        +'<div class="info-detail"><div class="info-detail-label">Энергия</div><div class="info-detail-value">'+r.energy+'</div></div>'
        +'<div class="info-detail"><div class="info-detail-label">Условия</div><div class="info-detail-value">'+r.cond+'</div></div>'
        +'<div class="info-detail"><div class="info-detail-label">Продукты</div><div class="info-detail-value">'+r.products.join(', ')+'</div></div>'
        +'<div class="info-detail"><div class="info-detail-label">Опасность</div><div class="info-detail-value">'+(r.danger===0?'? Безопасно':db+' '+r.danger+'/5')+'</div></div>'
        +'<div class="info-detail"><div class="info-detail-label">XP</div><div class="info-detail-value">+'+( r.xp||10)+'</div></div>'
        +'</div><div class="info-description">'+r.desc+'</div>'
        +(r.med?'<div class="info-medical"><h5>?? Медицина</h5><p>'+r.med+'</p></div>':'')
        +(r.danger>=3?'<div class="info-danger-warning">?? <strong>НЕ ПОВТОРЯТЬ</strong> без профессионального надзора!</div>':'')
        +'</div>';
    card.classList.add('visible');
}

function hideInfoCard(){const c=document.getElementById('chem-info-card');if(c)c.classList.remove('visible');}

function formatEquation(eq){
    return eq.replace(/>/g,'<span class="eq-arrow">></span>')
        .replace(/?/g,'<span class="eq-arrow">?</span>')
        .replace(/^/g,'<span class="eq-state gas">^</span>')
        .replace(/v/g,'<span class="eq-state ppt">v</span>');
}

// ========== 3D РЕАЛИСТИЧНЫЕ ВИЗУАЛЬНЫЕ ЭФФЕКТЫ v4 ==========

function spawnParticles(target,reaction,count){
    if(!target)return;
    const n=count||18;
    for(let i=0;i<n;i++){setTimeout(()=>{
        const p=document.createElement('div');p.className='reaction-particle';
        const angle=(Math.PI*2/n)*i+Math.random()*0.5;
        const dist=25+Math.random()*(reaction.danger>=3?140:80);
        const dur=0.5+Math.random()*0.7;
        p.style.left=target.offsetWidth/2+'px';p.style.top=target.offsetHeight*0.4+'px';
        p.style.setProperty('--dx',Math.cos(angle)*dist+'px');
        p.style.setProperty('--dy',Math.sin(angle)*dist+'px');
        p.style.setProperty('--dur',dur+'s');
        p.style.background=reaction.rc||'#6c5ce7';
        p.style.boxShadow='0 0 '+(4+Math.random()*6)+'px '+(reaction.rc||'#6c5ce7');
        const size=2+Math.random()*5;
        p.style.width=size+'px';p.style.height=size+'px';
        target.appendChild(p);setTimeout(()=>p.remove(),dur*1000+200);
    },i*15);}
}

function spawnSmoke(target,count){
    if(!target)return;
    const n=count||6;
    for(let i=0;i<n;i++){setTimeout(()=>{
        const s=document.createElement('div');s.className='smoke-puff';
        const size=25+Math.random()*30;
        s.style.width=size+'px';s.style.height=size+'px';
        s.style.left=(target.offsetWidth/2-size/2+Math.random()*40-20)+'px';
        s.style.top=(target.offsetHeight*0.25)+'px';
        s.style.setProperty('--drift',(Math.random()*30-15)+'px');
        s.style.opacity=String(0.4+Math.random()*0.3);
        target.appendChild(s);setTimeout(()=>s.remove(),3000);
    },i*120);}
}

function spawnBubbles(target,count,isFizz){
    if(!target)return;
    const n=count||12;
    for(let i=0;i<n;i++){setTimeout(()=>{
        const b=document.createElement('div');
        b.className='reaction-bubble'+(isFizz?' fizz-bubble':'');
        const size=isFizz?(2+Math.random()*6):(5+Math.random()*10);
        b.style.width=size+'px';b.style.height=size+'px';
        b.style.left=(target.offsetWidth*0.15+Math.random()*target.offsetWidth*0.7)+'px';
        b.style.bottom='20px';
        b.style.setProperty('--wobble',(Math.random()*16-8)+'px');
        target.appendChild(b);setTimeout(()=>b.remove(),isFizz?1500:2500);
    },i*(isFizz?40:100));}
}

function spawnPrecipitate(target,color,count){
    if(!target)return;
    const n=count||10;
    for(let i=0;i<n;i++){setTimeout(()=>{
        const p=document.createElement('div');p.className='precipitate-flake';
        const size=2+Math.random()*6;
        p.style.width=size+'px';p.style.height=size+'px';
        p.style.left=(target.offsetWidth*0.1+Math.random()*target.offsetWidth*0.8)+'px';
        p.style.top=(target.offsetHeight*0.15+Math.random()*20)+'px';
        p.style.background=color;
        p.style.boxShadow='0 0 4px '+color;
        p.style.setProperty('--fall',(50+Math.random()*40)+'px');
        p.style.setProperty('--drift',(Math.random()*20-10)+'px');
        target.appendChild(p);setTimeout(()=>p.remove(),3500);
    },i*120);}
}

function createScreenFlash(color,duration){
    const f=document.createElement('div');f.className='screen-flash';
    f.style.background=color||'rgba(255,255,255,0.8)';
    document.body.appendChild(f);
    requestAnimationFrame(()=>f.classList.add('active'));
    setTimeout(()=>{f.classList.remove('active');setTimeout(()=>f.remove(),600);},duration||300);
}

function createShockwave(target){
    if(!target)return;
    for(let i=0;i<3;i++){setTimeout(()=>{
        const ring=document.createElement('div');ring.className='shockwave-ring';
        ring.style.left=target.offsetWidth/2+'px';
        ring.style.top=target.offsetHeight*0.4+'px';
        target.appendChild(ring);setTimeout(()=>ring.remove(),1000);
    },i*150);}
}

function createFireball(target,size){
    if(!target)return;
    const fb=document.createElement('div');fb.className='fireball';
    const s=size||80;
    fb.style.width=s+'px';fb.style.height=s+'px';
    fb.style.left=(target.offsetWidth/2)+'px';
    fb.style.top=(target.offsetHeight*0.35)+'px';
    const core=document.createElement('div');core.className='fireball-core';
    core.style.width=s*0.4+'px';core.style.height=s*0.4+'px';
    fb.appendChild(core);
    target.appendChild(fb);
    setTimeout(()=>fb.remove(),1200);
}

function createEmbers(target,count){
    if(!target)return;
    for(let i=0;i<(count||20);i++){setTimeout(()=>{
        const e=document.createElement('div');e.className='ember-particle';
        const angle=Math.random()*Math.PI*2;
        const dist=20+Math.random()*120;
        const dur=0.6+Math.random()*1.4;
        e.style.left=target.offsetWidth/2+'px';
        e.style.top=target.offsetHeight*0.35+'px';
        e.style.setProperty('--dx',Math.cos(angle)*dist+'px');
        e.style.setProperty('--dy',(Math.sin(angle)*dist-50)+'px');
        e.style.setProperty('--dur',dur+'s');
        const size=1+Math.random()*4;
        e.style.width=size+'px';e.style.height=size+'px';
        const colors=['#ff6348','#ffbe76','#ff4757','#fff200','#ff9f43','#ffffff'];
        e.style.background=colors[Math.floor(Math.random()*colors.length)];
        e.style.boxShadow='0 0 '+(3+Math.random()*6)+'px '+e.style.background;
        target.appendChild(e);setTimeout(()=>e.remove(),dur*1000+200);
    },i*25);}
}

function createFlameColumn(target){
    if(!target)return;
    for(let i=0;i<12;i++){setTimeout(()=>{
        const f=document.createElement('div');f.className='flame-particle';
        const x=target.offsetWidth*0.25+Math.random()*target.offsetWidth*0.5;
        f.style.left=x+'px';f.style.bottom='25px';
        const size=6+Math.random()*18;
        f.style.width=size+'px';f.style.height=size*1.6+'px';
        f.style.setProperty('--sway',(Math.random()*24-12)+'px');
        f.style.setProperty('--rise',(-60-Math.random()*50)+'px');
        target.appendChild(f);setTimeout(()=>f.remove(),1800);
    },i*60);}
}

function createHeatShimmer(target){
    if(!target)return;
    const shimmer=document.createElement('div');shimmer.className='heat-shimmer';
    shimmer.style.left='10%';shimmer.style.right='10%';
    shimmer.style.top='0';shimmer.style.height='40%';
    target.appendChild(shimmer);
    setTimeout(()=>shimmer.remove(),5000);
}

function createMoltenDrips(target,color){
    if(!target)return;
    for(let i=0;i<8;i++){setTimeout(()=>{
        const d=document.createElement('div');d.className='molten-drip';
        d.style.left=(target.offsetWidth*0.15+Math.random()*target.offsetWidth*0.7)+'px';
        d.style.top=(target.offsetHeight*0.2)+'px';
        d.style.background=color||'#FF4500';
        d.style.boxShadow='0 0 8px '+(color||'#FF4500')+', 0 0 20px rgba(255,100,0,0.4)';
        d.style.setProperty('--fall',(40+Math.random()*70)+'px');
        const size=3+Math.random()*5;
        d.style.width=size+'px';d.style.height=size*1.5+'px';
        target.appendChild(d);setTimeout(()=>d.remove(),2000);
    },i*180);}
}

function createToxicCloud(target){
    if(!target)return;
    for(let i=0;i<10;i++){setTimeout(()=>{
        const c=document.createElement('div');c.className='toxic-cloud';
        const size=20+Math.random()*35;
        c.style.width=size+'px';c.style.height=size+'px';
        c.style.left=(target.offsetWidth*0.1+Math.random()*target.offsetWidth*0.8)+'px';
        c.style.top=(target.offsetHeight*0.2)+'px';
        c.style.setProperty('--drift',(Math.random()*40-20)+'px');
        target.appendChild(c);setTimeout(()=>c.remove(),3500);
    },i*130);}
    const skull=document.createElement('div');skull.className='toxic-skull';
    skull.textContent='\u2620\uFE0F';
    skull.style.left=target.offsetWidth/2+'px';
    skull.style.top=target.offsetHeight*0.05+'px';
    target.appendChild(skull);
    setTimeout(()=>skull.remove(),3000);
}

function createFoamEffect(target){
    if(!target)return;
    const body=target.querySelector('.flask-body');
    if(body){
        const foam=document.createElement('div');foam.className='foam-layer';
        body.appendChild(foam);setTimeout(()=>foam.remove(),5000);
    }
    for(let i=0;i<20;i++){setTimeout(()=>{
        const b=document.createElement('div');b.className='foam-bubble';
        const size=3+Math.random()*10;
        b.style.width=size+'px';b.style.height=size+'px';
        b.style.left=(target.offsetWidth*0.1+Math.random()*target.offsetWidth*0.8)+'px';
        b.style.bottom='30px';
        b.style.setProperty('--wobble',(Math.random()*20-10)+'px');
        target.appendChild(b);setTimeout(()=>b.remove(),3000);
    },i*70);}
}

function createGoldenRain(target){
    if(!target)return;
    for(let i=0;i<30;i++){setTimeout(()=>{
        const g=document.createElement('div');g.className='golden-crystal';
        g.style.left=(Math.random()*target.offsetWidth)+'px';
        g.style.top='-5px';
        g.style.setProperty('--fall',(target.offsetHeight+30)+'px');
        g.style.setProperty('--drift',(Math.random()*40-20)+'px');
        g.style.setProperty('--rot',(Math.random()*720)+'deg');
        const size=2+Math.random()*6;
        g.style.width=size+'px';g.style.height=size*1.5+'px';
        target.appendChild(g);setTimeout(()=>g.remove(),3500);
    },i*80);}
}

function createColorWave(target,color){
    if(!target)return;
    const body=target.querySelector('.flask-body');
    if(!body)return;
    const wave=document.createElement('div');wave.className='color-wave';
    wave.style.background=color;
    body.appendChild(wave);setTimeout(()=>wave.remove(),2500);
}

function createSparksSpray(target,count,color){
    if(!target)return;
    for(let i=0;i<(count||25);i++){setTimeout(()=>{
        const s=document.createElement('div');s.className='bright-spark';
        const angle=-Math.PI/2+(Math.random()-0.5)*Math.PI*1.2;
        const dist=30+Math.random()*130;
        const dur=0.4+Math.random()*0.8;
        s.style.left=target.offsetWidth/2+'px';s.style.top=target.offsetHeight*0.3+'px';
        s.style.setProperty('--dx',Math.cos(angle)*dist+'px');
        s.style.setProperty('--dy',Math.sin(angle)*dist+'px');
        s.style.setProperty('--dur',dur+'s');
        s.style.background=color||'#ffbe76';
        s.style.boxShadow='0 0 6px '+(color||'#ffbe76');
        const size=1.5+Math.random()*3;
        s.style.width=size+'px';s.style.height=size+'px';
        target.appendChild(s);setTimeout(()=>s.remove(),dur*1000+100);
    },i*18);}
}

function createDebris(target,color){
    if(!target)return;
    for(let i=0;i<15;i++){
        const d=document.createElement('div');d.className='debris-chunk';
        const angle=Math.random()*Math.PI*2;
        const dist=40+Math.random()*120;
        d.style.left=target.offsetWidth/2+'px';
        d.style.top=target.offsetHeight*0.35+'px';
        d.style.setProperty('--dx',Math.cos(angle)*dist+'px');
        d.style.setProperty('--dy',(Math.sin(angle)*dist-40)+'px');
        d.style.background=color||'#555';
        const size=2+Math.random()*7;
        d.style.width=size+'px';d.style.height=size*(0.5+Math.random()*0.8)+'px';
        d.style.setProperty('--rot',(Math.random()*720-360)+'deg');
        target.appendChild(d);setTimeout(()=>d.remove(),1500);
    }
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
    if(!history.length){list.innerHTML='<div class="history-empty-msg">?? Проведи первую реакцию!<br><small>Полка > Стол > Колба > Смешать!</small></div>';return;}
    list.innerHTML=history.slice(0,20).map((h,i)=>
        '<div class="hist-item" onclick="ChemLab.replayReaction('+i+')">'
        +'<div style="flex:1;min-width:0"><div class="hist-eq">'+h.eq.substring(0,50)+(h.eq.length>50?'…':'')+'</div><div class="hist-name">'+h.name+'</div></div>'
        +'<span class="hist-xp">+'+h.xp+'</span>'
        +(h.danger>=3?'<span class="hist-badge badge-danger">??</span>':'')
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

