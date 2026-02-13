/* ============================================
   CHEMISTRY LABORATORY — GAME ENGINE v3
   Realistic colors, 190+ reactions, XP/levels/achievements
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

    // Новые элементы
    B:{id:'B',symbol:'B',name:'Бор',cat:'nonmetal',num:5,color:'#5a3e2b',rc:'чёрный/коричневый'},
    Ne:{id:'Ne',symbol:'Ne',name:'Неон',cat:'noble',num:10,color:'#ffe0c0',rc:'бесцветный газ'},
    Ar:{id:'Ar',symbol:'Ar',name:'Аргон',cat:'noble',num:18,color:'#e0e8ff',rc:'бесцветный газ'},
    Se:{id:'Se',symbol:'Se',name:'Селен',cat:'nonmetal',num:34,color:'#808080',rc:'серый (металлический)'},
    Sr:{id:'Sr',symbol:'Sr',name:'Стронций',cat:'alkaline',num:38,color:'#d0c8b8',rc:'серебристо-жёлтый'},
    Mo:{id:'Mo',symbol:'Mo',name:'Молибден',cat:'transition',num:42,color:'#a0a8b0',rc:'серебристо-белый'},
    Pd:{id:'Pd',symbol:'Pd',name:'Палладий',cat:'transition',num:46,color:'#d0d0d0',rc:'серебристо-белый'},
    Cd:{id:'Cd',symbol:'Cd',name:'Кадмий',cat:'transition',num:48,color:'#c8c0b0',rc:'серебристый'},
    Sb:{id:'Sb',symbol:'Sb',name:'Сурьма',cat:'nonmetal',num:51,color:'#b0b0b8',rc:'серебристый'},
    Cs:{id:'Cs',symbol:'Cs',name:'Цезий',cat:'alkali',num:55,color:'#e8d8b0',rc:'золотистый'},
    La:{id:'La',symbol:'La',name:'Лантан',cat:'transition',num:57,color:'#c0c0c8',rc:'серебристо-белый'},
    Bi:{id:'Bi',symbol:'Bi',name:'Висмут',cat:'transition',num:83,color:'#d0b8c8',rc:'серебристо-розовый'},
    U:{id:'U',symbol:'U',name:'Уран',cat:'transition',num:92,color:'#a8a8a0',rc:'серебристо-белый'},

    // Новые соединения
    Na2SO4:{id:'Na2SO4',symbol:'Na₂SO₄',name:'Сульфат натрия',cat:'salt',color:'#ffffff',rc:'белые кристаллы'},
    MgSO4:{id:'MgSO4',symbol:'MgSO₄',name:'Сульфат магния',cat:'salt',color:'#f8f8f8',rc:'белые кристаллы'},
    AlCl3:{id:'AlCl3',symbol:'AlCl₃',name:'Хлорид алюминия',cat:'salt',color:'#f0f0e8',rc:'белый порошок'},
    CuCl2:{id:'CuCl2',symbol:'CuCl₂',name:'Хлорид меди(II)',cat:'salt',color:'#2E8B57',rc:'зелёные кристаллы'},
    FeCl2:{id:'FeCl2',symbol:'FeCl₂',name:'Хлорид железа(II)',cat:'salt',color:'#90b890',rc:'бледно-зелёные крист.'},
    NaNO3:{id:'NaNO3',symbol:'NaNO₃',name:'Нитрат натрия',cat:'salt',color:'#f8f8f0',rc:'белые кристаллы'},
    KBr:{id:'KBr',symbol:'KBr',name:'Бромид калия',cat:'salt',color:'#ffffff',rc:'белые кристаллы'},
    Na2SiO3:{id:'Na2SiO3',symbol:'Na₂SiO₃',name:'Силикат натрия',cat:'salt',color:'#e8e8f0',rc:'стекловидная масса'},
    CuO:{id:'CuO',symbol:'CuO',name:'Оксид меди(II)',cat:'oxide',color:'#1a1a1a',rc:'чёрный порошок'},
    ZnO:{id:'ZnO',symbol:'ZnO',name:'ZnO',cat:'oxide',color:'#ffffff',rc:'белый порошок'},
    P2O5:{id:'P2O5',symbol:'P₂O₅',name:'Оксид фосфора(V)',cat:'oxide',color:'#ffffff',rc:'белый порошок'},
    Cr2O3:{id:'Cr2O3',symbol:'Cr₂O₃',name:'Оксид хрома(III)',cat:'oxide',color:'#228B22',rc:'зелёный порошок'},
    SiO2:{id:'SiO2',symbol:'SiO₂',name:'Диоксид кремния',cat:'oxide',color:'#e8e8e0',rc:'бесцветный (кварц)'},
    HCOOH:{id:'HCOOH',symbol:'HCOOH',name:'Муравьиная кислота',cat:'acid',color:'#f0f0f0',rc:'бесцветная, жгучая'},
    H2CrO4:{id:'H2CrO4',symbol:'H₂CrO₄',name:'Хромовая кислота',cat:'acid',color:'#FFD700',rc:'жёлтый раствор'},
    C12H22O11:{id:'C12H22O11',symbol:'C₁₂H₂₂O₁₁',name:'Сахароза',cat:'organic',color:'#ffffff',rc:'белые кристаллы'},
    C2H4:{id:'C2H4',symbol:'C₂H₄',name:'Этилен',cat:'organic',color:'#e8e8f0',rc:'бесцветный газ'},
    C3H6O:{id:'C3H6O',symbol:'(CH₃)₂CO',name:'Ацетон',cat:'organic',color:'#f0f0e8',rc:'бесцветная жидкость'},
    C6H5OH:{id:'C6H5OH',symbol:'C₆H₅OH',name:'Фенол',cat:'organic',color:'#f8e8e8',rc:'бесцв. кристаллы'},
    starch:{id:'starch',symbol:'Крахмал',name:'Крахмал',cat:'organic',color:'#ffffff',rc:'белый порошок'},
    glycerol:{id:'glycerol',symbol:'Глицерин',name:'Глицерин',cat:'organic',color:'#f0f0f0',rc:'бесцветная вязкая'},
    CaC2:{id:'CaC2',symbol:'CaC₂',name:'Карбид кальция',cat:'salt',color:'#4a4a4a',rc:'серые куски'},
    Na2S2O3:{id:'Na2S2O3',symbol:'Na₂S₂O₃',name:'Тиосульфат натрия',cat:'salt',color:'#f8f8f0',rc:'бесцветные кристаллы'},
    KSCN:{id:'KSCN',symbol:'KSCN',name:'Тиоцианат калия',cat:'salt',color:'#f0f0f0',rc:'бесцветные кристаллы'},

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
    {r:['NH4Cl','NaOH'],eq:'NH₄Cl + NaOH → NaCl + NH₃↑ + H₂O',name:'Аммиак выделяется!',type:'endo',energy:'+16 кДж/моль',rc:'#e0ffe0',anim:'smoke',desc:'Резкий запах NH₃! Лакмус синеет от паров!',med:'Нашатырный спирт → пробуждение.',cond:'Нагрев',products:['NaCl','NH₃','H₂O'],danger:1,xp:20},

    // === НОВЫЕ РЕАКЦИИ ===
    {r:['Cu','Cl'],eq:'Cu + Cl₂ → CuCl₂',name:'Медь в хлоре 🔥',type:'exo',energy:'-220 кДж/моль',rc:'#2E8B57',anim:'burn',desc:'Медь горит в хлоре зелёным пламенем! Зелёная соль!',med:'CuCl₂ — олигоэлемент в медицине.',cond:'Нагрев',products:['CuCl₂'],danger:3,xp:35},
    {r:['Mg','N'],eq:'3Mg + N₂ → Mg₃N₂',name:'Магний + азот',type:'exo',energy:'-461 кДж/моль',rc:'#e8e8d0',anim:'burn',desc:'При высокой t° магний горит даже в азоте!',med:'Mg₃N₂ + вода → NH₃ (мед. аммиак).',cond:'Высокая t°',products:['Mg₃N₂'],danger:2,xp:30},
    {r:['Al','H2SO4'],eq:'2Al + 3H₂SO₄ → Al₂(SO₄)₃ + 3H₂↑',name:'Алюминий + серная',type:'exo',energy:'-1050 кДж',rc:'#e0e0e0',anim:'bubble',desc:'Сильно пузырится! Алюминий растворяется!',med:'Квасцы алюминия — антиперспирант.',cond:'Разбавленная',products:['Al₂(SO₄)₃','H₂'],danger:1,xp:20},
    {r:['Fe','Cl'],eq:'2Fe + 3Cl₂ → 2FeCl₃',name:'Железо в хлоре 🔥',type:'exo',energy:'-802 кДж/моль',rc:'#8B4513',anim:'burn',desc:'Железо раскалённое горит в хлоре — бурый дым FeCl₃!',med:'FeCl₃ — кровоостанавливающее (местно).',cond:'Нагрев',products:['FeCl₃'],danger:3,xp:35},
    {r:['CuO','HCl'],eq:'CuO + 2HCl → CuCl₂ + H₂O',name:'Оксид меди + HCl 🟢',type:'exo',energy:'-65 кДж/моль',rc:'#2E8B57',anim:'heat',desc:'Чёрный порошок растворяется → ЗЕЛЁНЫЙ раствор!',med:'Cu²⁺ — катализатор ферментов.',cond:'Нагрев',products:['CuCl₂','H₂O'],danger:0,xp:15},
    {r:['CuO','H2SO4'],eq:'CuO + H₂SO₄ → CuSO₄ + H₂O',name:'Оксид меди + серная 🔵',type:'exo',energy:'-70 кДж/моль',rc:'#1E90FF',anim:'heat',desc:'Чёрный → ГОЛУБОЙ раствор CuSO₄!',med:'CuSO₄ — рвотное средство при отравлениях.',cond:'Нагрев',products:['CuSO₄','H₂O'],danger:0,xp:15},
    {r:['ZnO','HCl'],eq:'ZnO + 2HCl → ZnCl₂ + H₂O',name:'Оксид цинка + HCl',type:'exo',energy:'-60 кДж/моль',rc:'#f0f0f0',anim:'heat',desc:'Белый порошок растворяется — бесцветный раствор.',med:'ZnO — цинковая мазь, заживление.',cond:'t° комнатная',products:['ZnCl₂','H₂O'],danger:0,xp:10},
    {r:['ZnO','NaOH'],eq:'ZnO + 2NaOH → Na₂ZnO₂ + H₂O',name:'ZnO — амфотерный!',type:'exo',energy:'-40 кДж/моль',rc:'#f0f0f8',anim:'heat',desc:'ZnO растворяется и в щёлочи! Амфотерный оксид!',med:'Цинкаты в фармхимии.',cond:'t° комнатная',products:['Na₂ZnO₂','H₂O'],danger:0,xp:20},
    {r:['Al2O3','HCl'],eq:'Al₂O₃ + 6HCl → 2AlCl₃ + 3H₂O',name:'Al₂O₃ — амфотерный',type:'exo',energy:'-200 кДж',rc:'#f0f0f0',anim:'heat',desc:'Корунд (Al₂O₃) растворяется в кислоте!',med:'Al₂O₃ — абразив в стоматологии.',cond:'Нагрев',products:['AlCl₃','H₂O'],danger:0,xp:15},
    {r:['Al2O3','NaOH'],eq:'Al₂O₃ + 2NaOH → 2NaAlO₂ + H₂O',name:'Корунд + щёлочь',type:'exo',energy:'-60 кДж',rc:'#f0f0f8',anim:'heat',desc:'Амфотерность! Al₂O₃ растворяется и в щёлочи!',med:'Алюминаты используют в водоочистке.',cond:'Плавление',products:['NaAlO₂','H₂O'],danger:1,xp:25},
    {r:['Na2SiO3','HCl'],eq:'Na₂SiO₃ + 2HCl → 2NaCl + H₂SiO₃↓',name:'Кремниевый гель 🫧',type:'neutral',energy:'-50 кДж/моль',rc:'#e8e8e8',anim:'precipitate',desc:'Бесцветный студенистый осадок! Силикагель!',med:'Силикагель — сорбент (пакетики с шариками).',cond:'t° комнатная',products:['NaCl','H₂SiO₃'],danger:0,xp:20},
    {r:['Ca_OH_2','HCl'],eq:'Ca(OH)₂ + 2HCl → CaCl₂ + 2H₂O',name:'Известь + HCl',type:'exo',energy:'-110 кДж/моль',rc:'#f0f0f0',anim:'heat',desc:'Нейтрализация. Прозрачный раствор!',med:'CaCl₂ — в/в при гипокальциемии, аллергии.',cond:'t° комнатная',products:['CaCl₂','H₂O'],danger:0,xp:15},
    {r:['FeCl3','KI'],eq:'2FeCl₃ + 2KI → 2FeCl₂ + I₂ + 2KCl',name:'Выделение йода 🟤',type:'exo',energy:'-60 кДж',rc:'#4a0080',anim:'color',desc:'Раствор БУРО-КОРИЧНЕВОГО цвета! Йод выделяется!',med:'Проба на крахмал (с йодом → синий).',cond:'t° комнатная',products:['FeCl₂','I₂','KCl'],danger:0,xp:25},
    {r:['starch','I'],eq:'Крахмал + I₂ → СИНИЙ ЦВЕТ',name:'Йодная проба! 💙',type:'neutral',energy:'0',rc:'#00008B',anim:'color',desc:'ТЁМНО-СИНИЙ цвет! Качественная реакция на крахмал!',med:'Проба на крахмал в пищевых продуктах, диабетология.',cond:'t° комнатная',products:['Синий комплекс'],danger:0,xp:20},
    {r:['Cs','H2O'],eq:'2Cs + 2H₂O → 2CsOH + H₂↑',name:'Цезий + вода 💥💥💥',type:'exo',energy:'-218 кДж/моль',rc:'#ffe0a0',anim:'explode',desc:'САМЫЙ МОЩНЫЙ ВЗРЫВ! Цезий реагирует мгновенно!',med:'Cs-137 — источник γ-излучения в лучевой терапии.',cond:'МГНОВЕННЫЙ ВЗРЫВ!',products:['CsOH','H₂'],danger:5,xp:70},
    {r:['C12H22O11','H2SO4'],eq:'C₁₂H₂₂O₁₁ + H₂SO₄(конц.) → 12C + 11H₂O',name:'Чёрная змея 🐍🖤',type:'exo',energy:'-200 кДж',rc:'#1a1a1a',anim:'foam',desc:'Сахар ЧЕРНЕЕТ, растёт «змея» из угля! Дым, запах!',med:'Серная кислота — дегидратация (обезвоживание ткани!).',cond:'Конц. H₂SO₄',products:['C','H₂O'],danger:4,xp:55},
    {r:['C2H4','Br'],eq:'C₂H₄ + Br₂ → C₂H₄Br₂',name:'Обесцвечивание брома 🟡→⚪',type:'exo',energy:'-108 кДж/моль',rc:'#f0f0f0',anim:'decolor',desc:'Бурый → БЕСЦВЕТНЫЙ! Качественная на C=C (двойную связь)!',med:'Определение ненасыщенных жирных кислот.',cond:'t° комнатная',products:['C₂H₄Br₂'],danger:2,xp:25},
    {r:['C2H4','H2O'],eq:'C₂H₄ + H₂O → C₂H₅OH',name:'Гидратация этилена',type:'exo',energy:'-45 кДж/моль',rc:'#f0e8d8',anim:'heat',desc:'Этилен + вода → ЭТАНОЛ! Промышленный способ.',med:'Этанол — универсальный растворитель в фармации.',cond:'Кат. H₃PO₄, 300°C',products:['C₂H₅OH'],danger:0,xp:25},
    {r:['C6H5OH','FeCl3'],eq:'C₆H₅OH + FeCl₃ → ФИОЛЕТОВЫЙ ЦВЕТ',name:'Фенол + хлорид железа 💜',type:'neutral',energy:'0',rc:'#800080',anim:'color',desc:'ФИОЛЕТОВЫЙ ЦВЕТ! Качественная на фенол!',med:'Определение фенолов в лекарствах.',cond:'t° комнатная',products:['Фиолетовый комплекс'],danger:1,xp:25},
    {r:['glycerol','KMnO4'],eq:'Глицерин + KMnO₄ → САМОВОСПЛАМЕНЕНИЕ!',name:'Глицерин + марганцовка 🔥',type:'exo',energy:'-800 кДж',rc:'#FF4500',anim:'explode',desc:'САМОВОСПЛАМЕНЕНИЕ! Яркий огонь через 30 секунд!',med:'Глицерин — основа суппозиториев. Нитроглицерин → стенокардия.',cond:'Измельчённый KMnO₄',products:['CO₂','H₂O','MnO₂'],danger:4,xp:55},
    {r:['C3H6O','I'],eq:'(CH₃)₂CO + I₂ → CH₃COCHI₂ (иодоформ)',name:'Иодоформная проба 🟡',type:'neutral',energy:'-30 кДж',rc:'#FFD700',anim:'precipitate',desc:'ЖЁЛТЫЙ осадок иодоформа! Характерный запах!',med:'Иодоформная проба → определение ацетона в моче (диабет!).',cond:'NaOH, нагрев',products:['CHI₃'],danger:1,xp:30},
    {r:['HCOOH','AgNO3'],eq:'HCOOH + 2AgNO₃ → 2Ag↓ + CO₂ + 2HNO₃',name:'Серебряное зеркало ✨🪞',type:'exo',energy:'-100 кДж/моль',rc:'#e8e8e8',anim:'crystals',desc:'На стенках — ЗЕРКАЛЬНЫЙ слой серебра! Реакция серебряного зеркала!',med:'Определение альдегидов и муравьиной кислоты.',cond:'Нагрев, NH₃',products:['Ag','CO₂','HNO₃'],danger:0,xp:35},
    {r:['C6H12O6','AgNO3'],eq:'Глюкоза + AgNO₃(NH₃) → Ag↓ (зеркало)',name:'Глюкоза → серебряное зеркало ✨',type:'exo',energy:'-80 кДж',rc:'#e8e8e8',anim:'crystals',desc:'Глюкоза восстанавливает серебро! Зеркальная плёнка!',med:'Проба Толленса на глюкозу в моче! Диабет!',cond:'Нагрев, NH₃',products:['Ag','глюконовая к-та'],danger:0,xp:35},
    {r:['Bi','HNO3'],eq:'Bi + 4HNO₃ → Bi(NO₃)₃ + NO↑ + 2H₂O',name:'Висмут + азотная',type:'exo',energy:'-120 кДж',rc:'#f0f0f0',anim:'smoke',desc:'Висмут растворяется, бурый газ!',med:'Висмут — компонент Де-Нол (язва желудка).',cond:'Нагрев',products:['Bi(NO₃)₃','NO','H₂O'],danger:2,xp:30},
    {r:['Sr','H2O'],eq:'Sr + 2H₂O → Sr(OH)₂ + H₂↑',name:'Стронций + вода 🔴',type:'exo',energy:'-180 кДж/моль',rc:'#FF4500',anim:'burn',desc:'Бурная реакция! Красное свечение пламени!',med:'Sr — в зубных пастах для чувствительных зубов.',cond:'t° комнатная',products:['Sr(OH)₂','H₂'],danger:2,xp:30},
    {r:['P2O5','H2O'],eq:'P₂O₅ + 3H₂O → 2H₃PO₄',name:'Фосфорный ангидрид + вода',type:'exo',energy:'-180 кДж/моль',rc:'#f8f8f0',anim:'boil',desc:'СИЛЬНЕЙШИЙ осушитель! Бурная реакция с водой!',med:'H₃PO₄ → фосфаты в костях и ДНК.',cond:'t° комнатная',products:['H₃PO₄'],danger:2,xp:25},
    {r:['Mg','CO2'],eq:'2Mg + CO₂ → 2MgO + C',name:'Магний горит в CO₂! 🔥',type:'exo',energy:'-810 кДж/моль',rc:'#2d2d2d',anim:'flash',desc:'Магний горит даже в углекислом газе! Углерод и MgO!',med:'CO₂ огнетушитель НЕ работает для Mg!',cond:'Поджиг',products:['MgO','C'],danger:3,xp:45},
    {r:['phenol','HCl'],eq:'Фенолфталеин + кислота → БЕСЦВЕТНЫЙ',name:'Фенолфталеин не меняется',type:'neutral',energy:'0',rc:'#f0f0f0',anim:'none',desc:'В кислоте фенолфталеин остаётся БЕСЦВЕТНЫМ.',med:'Индикатор не реагирует до pH 8.2.',cond:'pH < 8.2',products:['Бесцветный р-р'],danger:0,xp:10},
    {r:['litmus','H2SO4'],eq:'Лакмус + серная → КРАСНЫЙ',name:'Лакмус + серная!',type:'neutral',energy:'0',rc:'#DC143C',anim:'color',desc:'Фиолетовый → КРАСНЫЙ!',med:'Индикация кислотности.',cond:'pH < 5',products:['Красный р-р'],danger:0,xp:15},
    {r:['methyl_o','NaOH'],eq:'Метилоранж + щёлочь → ЖЁЛТЫЙ',name:'Метилоранж желтеет!',type:'neutral',energy:'0',rc:'#FFD700',anim:'color',desc:'Оранжевый → ЖЁЛТЫЙ в щёлочи!',med:'Определение щёлочности крови.',cond:'pH > 4.4',products:['Жёлтый р-р'],danger:0,xp:15},
    {r:['phenol','KOH'],eq:'Фенолфталеин + KOH → МАЛИНОВЫЙ',name:'Фенолфталеин + KOH 🩷',type:'neutral',energy:'0',rc:'#FF1493',anim:'color',desc:'Малиновый цвет! Та же реакция, что с NaOH.',med:'Индикация pH лекарственных форм.',cond:'pH > 8.2',products:['Малиновый р-р'],danger:0,xp:15},
    {r:['KOH','H2SO4'],eq:'2KOH + H₂SO₄ → K₂SO₄ + 2H₂O',name:'KOH + серная',type:'exo',energy:'-114 кДж/моль',rc:'#f0f0f0',anim:'boil',desc:'Нейтрализация с сильным нагревом!',med:'K₂SO₄ — калийное удобрение.',cond:'Осторожно!',products:['K₂SO₄','H₂O'],danger:1,xp:15},
    {r:['Mg','H2SO4'],eq:'Mg + H₂SO₄ → MgSO₄ + H₂↑',name:'Магний + серная',type:'exo',energy:'-467 кДж/моль',rc:'#f0f0f0',anim:'boil',desc:'Очень бурная реакция! Магнезия!',med:'MgSO₄ — магнезия (слабительное, токолитик).',cond:'Разбавленная',products:['MgSO₄','H₂'],danger:1,xp:20},
    {r:['Pb','HNO3'],eq:'3Pb + 8HNO₃ → 3Pb(NO₃)₂ + 2NO↑ + 4H₂O',name:'Свинец + азотная ☠️',type:'exo',energy:'-120 кДж',rc:'#f0f0f0',anim:'smoke',desc:'Свинец растворяется! Бурый газ!',med:'⚠️ Свинец — нейротоксин! Сатурнизм.',cond:'Разбавленная',products:['Pb(NO₃)₂','NO','H₂O'],danger:3,xp:35},
    {r:['AgNO3','KBr'],eq:'AgNO₃ + KBr → AgBr↓ + KNO₃',name:'Бледно-жёлтый AgBr 🟡',type:'neutral',energy:'-60 кДж/моль',rc:'#FFFFE0',anim:'precipitate',desc:'БЛЕДНО-ЖЁЛТЫЙ осадок! Качественная на Br⁻.',med:'AgBr — фоточувствительный (рентгенплёнка).',cond:'t° комнатная',products:['AgBr','KNO₃'],danger:0,xp:20},
    {r:['CaCl2','Na2CO3'],eq:'CaCl₂ + Na₂CO₃ → CaCO₃↓ + 2NaCl',name:'Осадок мела ⚪',type:'neutral',energy:'-45 кДж/моль',rc:'#ffffff',anim:'precipitate',desc:'Белый осадок CaCO₃ (мел/мрамор)!',med:'CaCO₃ — антацид, источник кальция.',cond:'t° комнатная',products:['CaCO₃','NaCl'],danger:0,xp:15},

    // ═══════════════════════════════════════
    // НЕЙТРАЛИЗАЦИЯ (дополнительные)
    // ═══════════════════════════════════════
    {r:['Ba_OH_2','HCl'],eq:'Ba(OH)₂ + 2HCl → BaCl₂ + 2H₂O',name:'Ba(OH)₂ + HCl',type:'exo',energy:'-118 кДж/моль',rc:'#f0f0f0',anim:'heat',desc:'Нейтрализация. Прозрачный раствор BaCl₂.',med:'BaCl₂ используется при рентгенодиагностике.',cond:'t° комнатная',products:['BaCl₂','H₂O'],danger:0,xp:10},
    {r:['Ca_OH_2','H2SO4'],eq:'Ca(OH)₂ + H₂SO₄ → CaSO₄↓ + 2H₂O',name:'Гипс! ⚪',type:'exo',energy:'-116 кДж/моль',rc:'#ffffff',anim:'precipitate',desc:'Белый осадок CaSO₄ — ГИПС! Почти не растворяется!',med:'Гипс в хирургии — гипсовые повязки, ортопедия.',cond:'t° комнатная',products:['CaSO₄','H₂O'],danger:0,xp:20},
    {r:['NH4OH','HCl'],eq:'NH₄OH + HCl → NH₄Cl + H₂O',name:'Аммиачная вода + HCl',type:'exo',energy:'-52 кДж/моль',rc:'#f0f0f0',anim:'heat',desc:'Слабое основание + сильная кислота → нашатырь.',med:'NH₄Cl — отхаркивающее средство.',cond:'t° комнатная',products:['NH₄Cl','H₂O'],danger:0,xp:10},
    {r:['NaOH','H3PO4'],eq:'3NaOH + H₃PO₄ → Na₃PO₄ + 3H₂O',name:'NaOH + фосфорная',type:'exo',energy:'-155 кДж/моль',rc:'#f0f0f0',anim:'heat',desc:'Нейтрализация. Фосфат натрия.',med:'Na₃PO₄ — пищевая добавка E339.',cond:'t° комнатная',products:['Na₃PO₄','H₂O'],danger:0,xp:15},
    {r:['Ca_OH_2','H3PO4'],eq:'3Ca(OH)₂ + 2H₃PO₄ → Ca₃(PO₄)₂↓ + 6H₂O',name:'Фосфат кальция! 🦴',type:'exo',energy:'-200 кДж',rc:'#f8f8f0',anim:'precipitate',desc:'Белый осадок — основа КОСТЕЙ и ЗУБОВ человека!',med:'Ca₃(PO₄)₂ — 65% массы костей! Гидроксиапатит.',cond:'t° комнатная',products:['Ca₃(PO₄)₂','H₂O'],danger:0,xp:30},
    {r:['KOH','HNO3'],eq:'KOH + HNO₃ → KNO₃ + H₂O',name:'KOH + азотная → селитра',type:'exo',energy:'-55 кДж/моль',rc:'#f0f0f0',anim:'heat',desc:'Калийная селитра KNO₃ — компонент чёрного пороха!',med:'KNO₃ — в зубных пастах для чувствительных зубов.',cond:'t° комнатная',products:['KNO₃','H₂O'],danger:0,xp:15},
    {r:['NaOH','HBr'],eq:'NaOH + HBr → NaBr + H₂O',name:'NaOH + бромоводородная',type:'exo',energy:'-56 кДж/моль',rc:'#f0f0f0',anim:'heat',desc:'Нейтрализация. Бромид натрия.',med:'NaBr — седативное средство (бромиды).',cond:'t° комнатная',products:['NaBr','H₂O'],danger:0,xp:10},
    {r:['NaOH','HF'],eq:'NaOH + HF → NaF + H₂O',name:'NaOH + плавиковая → фторид',type:'exo',energy:'-68 кДж/моль',rc:'#f0f0f0',anim:'heat',desc:'Фторид натрия — стоматологическое средство!',med:'NaF — укрепление эмали зубов. Фторирование воды.',cond:'t° комнатная',products:['NaF','H₂O'],danger:1,xp:15},

    // ═══════════════════════════════════════
    // МЕТАЛЛЫ + КИСЛОТЫ (новые)
    // ═══════════════════════════════════════
    {r:['Sn','HCl'],eq:'Sn + 2HCl → SnCl₂ + H₂↑',name:'Олово + HCl',type:'exo',energy:'-61 кДж/моль',rc:'#e0e0e0',anim:'bubble',desc:'Олово медленно растворяется — пузырьки H₂.',med:'SnCl₂ — восстановитель в фармхимическом синтезе.',cond:'Нагрев',products:['SnCl₂','H₂'],danger:0,xp:15},
    {r:['Ni','HCl'],eq:'Ni + 2HCl → NiCl₂ + H₂↑',name:'Никель + HCl 🟢',type:'exo',energy:'-78 кДж/моль',rc:'#90EE90',anim:'bubble',desc:'Растворяется медленно → ЗЕЛЁНЫЙ раствор NiCl₂!',med:'Ni вызывает контактную аллергию (серёжки, пряжки).',cond:'Нагрев',products:['NiCl₂','H₂'],danger:0,xp:15},
    {r:['Co','HCl'],eq:'Co + 2HCl → CoCl₂ + H₂↑',name:'Кобальт + HCl 🩷',type:'exo',energy:'-72 кДж/моль',rc:'#FF69B4',anim:'bubble',desc:'Растворяется → РОЗОВЫЙ раствор CoCl₂!',med:'Co — центральный атом витамина B₁₂! Анемия.',cond:'Нагрев',products:['CoCl₂','H₂'],danger:0,xp:15},
    {r:['Mn','HCl'],eq:'Mn + 2HCl → MnCl₂ + H₂↑',name:'Марганец + HCl',type:'exo',energy:'-81 кДж/моль',rc:'#ffe0e0',anim:'bubble',desc:'Марганец растворяется — бледно-розовый раствор.',med:'Mn — активатор ферментов (аргиназа, пируваткарбоксилаза).',cond:'t° комнатная',products:['MnCl₂','H₂'],danger:0,xp:15},
    {r:['Cr','HCl'],eq:'Cr + 2HCl → CrCl₂ + H₂↑',name:'Хром + HCl 🔵',type:'exo',energy:'-70 кДж/моль',rc:'#4169E1',anim:'bubble',desc:'Хром растворяется → СИНИЙ раствор Cr²⁺! Без доступа воздуха!',med:'Cr³⁺ — микроэлемент (толерантность к глюкозе).',cond:'Нагрев, без O₂',products:['CrCl₂','H₂'],danger:0,xp:20},
    {r:['Fe','H2SO4'],eq:'Fe + H₂SO₄(разб.) → FeSO₄ + H₂↑',name:'Железо + серная',type:'exo',energy:'-92 кДж/моль',rc:'#90b890',anim:'bubble',desc:'Железо растворяется — зеленоватый раствор FeSO₄.',med:'FeSO₄ — препарат железа при анемии (Сорбифер).',cond:'Разбавленная',products:['FeSO₄','H₂'],danger:0,xp:15},
    {r:['Zn','HNO3'],eq:'4Zn + 10HNO₃(разб.) → 4Zn(NO₃)₂ + NH₄NO₃ + 3H₂O',name:'Цинк + азотная (хитрая!)',type:'exo',energy:'-180 кДж',rc:'#e8e8e8',anim:'heat',desc:'С разб. HNO₃ водород НЕ выделяется! Образуется NH₄⁺!',med:'HNO₃ — окислитель, восстанавливается не до H₂!',cond:'Разбавленная',products:['Zn(NO₃)₂','NH₄NO₃','H₂O'],danger:1,xp:25},
    {r:['Mg','HNO3'],eq:'4Mg + 10HNO₃(разб.) → 4Mg(NO₃)₂ + NH₄NO₃ + 3H₂O',name:'Магний + азотная',type:'exo',energy:'-220 кДж',rc:'#f0f0f0',anim:'boil',desc:'Бурная реакция! Mg очень активен! N⁵⁺ → N⁻³ (NH₄⁺).',med:'Mg(NO₃)₂ в фармхимии.',cond:'Разбавленная',products:['Mg(NO₃)₂','NH₄NO₃','H₂O'],danger:1,xp:25},

    // ═══════════════════════════════════════
    // МЕТАЛЛЫ + ВОДА
    // ═══════════════════════════════════════
    {r:['Ba','H2O'],eq:'Ba + 2H₂O → Ba(OH)₂ + H₂↑',name:'Барий + вода',type:'exo',energy:'-190 кДж/моль',rc:'#f0f0f0',anim:'bubble',desc:'Барий активно реагирует с водой! Щёлочь + водород!',med:'⚠️ Растворимые соли Ba²⁺ ЯДОВИТЫ (кроме BaSO₄)!',cond:'t° комнатная',products:['Ba(OH)₂','H₂'],danger:2,xp:25},

    // ═══════════════════════════════════════
    // ГОРЕНИЕ (новые)
    // ═══════════════════════════════════════
    {r:['CH3OH','O'],eq:'2CH₃OH + 3O₂ → 2CO₂ + 4H₂O',name:'Горение метанола 🔥👻',type:'exo',energy:'-726 кДж/моль',rc:'#e0e0ff',anim:'burn',desc:'НЕВИДИМОЕ пламя! Метанол горит почти незаметно — крайне опасно!',med:'⚠️ Метанол СМЕРТЕЛЕН! 10 мл → слепота, 30 мл → смерть!',cond:'Поджиг',products:['CO₂','H₂O'],danger:3,xp:30},
    {r:['Al','O'],eq:'4Al + 3O₂ → 2Al₂O₃',name:'Горение алюминия ✨',type:'exo',energy:'-3352 кДж/моль',rc:'#ffffff',anim:'flash',desc:'ЯРЧАЙШАЯ вспышка! Применяется в фейерверках и ракетном топливе!',med:'Al₂O₃ — абразив стоматологический.',cond:'Поджиг порошка',products:['Al₂O₃'],danger:3,xp:40},
    {r:['Na','O'],eq:'4Na + O₂ → 2Na₂O',name:'Натрий горит 🟡',type:'exo',energy:'-416 кДж/моль',rc:'#FFD700',anim:'burn',desc:'Натрий горит ЖЁЛТЫМ пламенем! Характерный цвет!',med:'Жёлтый цвет пламени — тест на Na⁺.',cond:'Поджиг',products:['Na₂O'],danger:3,xp:30},
    {r:['Ca','O'],eq:'2Ca + O₂ → 2CaO',name:'Горение кальция 🟠',type:'exo',energy:'-1270 кДж/моль',rc:'#ff8c00',anim:'burn',desc:'Красновато-оранжевое пламя! Негашёная известь CaO!',med:'CaO — негашёная известь (дезинфекция).',cond:'Поджиг',products:['CaO'],danger:2,xp:25},
    {r:['B','O'],eq:'4B + 3O₂ → 2B₂O₃',name:'Горение бора 🟢',type:'exo',energy:'-2540 кДж/моль',rc:'#00FF00',anim:'burn',desc:'Бор горит ЗЕЛЁНЫМ пламенем! Красивое зрелище!',med:'Борная кислота (H₃BO₃) — антисептик для глаз.',cond:'Высокая t°',products:['B₂O₃'],danger:2,xp:35},
    {r:['Se','O'],eq:'Se + O₂ → SeO₂',name:'Горение селена',type:'exo',energy:'-225 кДж/моль',rc:'#f0f0e8',anim:'smoke',desc:'Селен горит голубым пламенем. Характерный запах хрена!',med:'Se — антиоксидант, в составе глутатионпероксидазы.',cond:'Поджиг',products:['SeO₂'],danger:2,xp:25},

    // ═══════════════════════════════════════
    // ОСАЖДЕНИЕ (новые)
    // ═══════════════════════════════════════
    {r:['CuSO4','Na2S'],eq:'CuSO₄ + Na₂S → CuS↓ + Na₂SO₄',name:'ЧЁРНЫЙ сульфид меди ⚫',type:'neutral',energy:'-90 кДж/моль',rc:'#0a0a0a',anim:'precipitate',desc:'ЧЁРНЫЙ осадок CuS! Абсолютно нерастворимый!',med:'Определение Cu²⁺ в биологических жидкостях.',cond:'t° комнатная',products:['CuS','Na₂SO₄'],danger:0,xp:25},
    {r:['AgNO3','Na2S'],eq:'2AgNO₃ + Na₂S → Ag₂S↓ + 2NaNO₃',name:'ЧЁРНОЕ серебро ⚫',type:'neutral',energy:'-130 кДж/моль',rc:'#0a0a0a',anim:'precipitate',desc:'ЧЁРНЫЙ осадок Ag₂S! Почему чернеет серебро!',med:'Потемнение серебряных украшений — Ag₂S от H₂S в воздухе.',cond:'t° комнатная',products:['Ag₂S','NaNO₃'],danger:0,xp:25},
    {r:['FeCl3','Na2CO3'],eq:'2FeCl₃ + 3Na₂CO₃ + 3H₂O → 2Fe(OH)₃↓ + 3CO₂↑ + 6NaCl',name:'Бурый осадок + газ 🟤🫧',type:'exo',energy:'-80 кДж',rc:'#8B4513',anim:'fizz',desc:'БУРЫЙ осадок Fe(OH)₃ + бурные пузырьки CO₂! Двойная реакция!',med:'Соли Fe³⁺ полностью гидролизуются в присутствии карбонатов.',cond:'t° комнатная',products:['Fe(OH)₃','CO₂','NaCl'],danger:0,xp:25},
    {r:['BaCl2','Na2CO3'],eq:'BaCl₂ + Na₂CO₃ → BaCO₃↓ + 2NaCl',name:'Белый BaCO₃ ⚪',type:'neutral',energy:'-50 кДж/моль',rc:'#ffffff',anim:'precipitate',desc:'Белый осадок карбоната бария!',med:'⚠️ BaCO₃ ЯДОВИТ! Используется как яд для грызунов.',cond:'t° комнатная',products:['BaCO₃','NaCl'],danger:1,xp:20},
    {r:['BaCl2','Na2SO4'],eq:'BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl',name:'BaSO₄ рентгеноконтраст ⚪',type:'neutral',energy:'-50 кДж/моль',rc:'#ffffff',anim:'precipitate',desc:'Белый тяжёлый осадок BaSO₄! Нерастворим!',med:'BaSO₄ БЕЗОПАСЕН (нерастворим)! «Бариевая каша» для рентгена ЖКТ.',cond:'t° комнатная',products:['BaSO₄','NaCl'],danger:0,xp:20},
    {r:['CuSO4','Na2CO3'],eq:'CuSO₄ + Na₂CO₃ → CuCO₃↓ + Na₂SO₄',name:'Зелёный малахит 💚',type:'neutral',energy:'-40 кДж',rc:'#2E8B57',anim:'precipitate',desc:'ЗЕЛЁНЫЙ осадок — цвет малахита! Основной карбонат Cu.',med:'Малахитовый зелёный — краситель для микроскопии бактерий.',cond:'t° комнатная',products:['CuCO₃','Na₂SO₄'],danger:0,xp:20},
    {r:['PbNO3_2','HCl'],eq:'Pb(NO₃)₂ + 2HCl → PbCl₂↓ + 2HNO₃',name:'Осадок PbCl₂ ⚪',type:'neutral',energy:'-35 кДж/моль',rc:'#ffffff',anim:'precipitate',desc:'Белый осадок PbCl₂! Растворяется в ГОРЯЧЕЙ воде!',med:'⚠️ Свинцовое отравление — сатурнизм. Pb поражает ЦНС.',cond:'t° комнатная',products:['PbCl₂','HNO₃'],danger:1,xp:20},
    {r:['AgNO3','Na2CO3'],eq:'2AgNO₃ + Na₂CO₃ → Ag₂CO₃↓ + 2NaNO₃',name:'Жёлтый Ag₂CO₃ 🟡',type:'neutral',energy:'-55 кДж/моль',rc:'#e8e8a0',anim:'precipitate',desc:'ЖЁЛТЫЙ осадок карбоната серебра!',med:'Ag₂CO₃ — реагент Фелинга для определения альдегидов.',cond:'t° комнатная',products:['Ag₂CO₃','NaNO₃'],danger:0,xp:20},
    {r:['FeCl2','NaOH'],eq:'FeCl₂ + 2NaOH → Fe(OH)₂↓ + 2NaCl',name:'ЗЕЛЁНЫЙ осадок Fe²⁺ 🟢',type:'neutral',energy:'-60 кДж/моль',rc:'#228B22',anim:'precipitate',desc:'Бело-ЗЕЛЁНЫЙ осадок Fe(OH)₂! На воздухе БУРЕЕТ (→ Fe³⁺)!',med:'Fe²⁺ → Fe³⁺ + e⁻ — окисление. В организме постоянно.',cond:'Без доступа воздуха!',products:['Fe(OH)₂','NaCl'],danger:0,xp:25},
    {r:['CuCl2','NaOH'],eq:'CuCl₂ + 2NaOH → Cu(OH)₂↓ + 2NaCl',name:'Голубой гель Cu(OH)₂ 🔵',type:'neutral',energy:'-65 кДж/моль',rc:'#4169E1',anim:'precipitate',desc:'ГОЛУБОЙ студенистый осадок Cu(OH)₂!',med:'Cu(OH)₂ — биуретовая реакция на белки.',cond:'t° комнатная',products:['Cu(OH)₂','NaCl'],danger:0,xp:20},
    {r:['AlCl3','NaOH'],eq:'AlCl₃ + 3NaOH → Al(OH)₃↓ + 3NaCl',name:'Студенистый Al(OH)₃ ⚪',type:'neutral',energy:'-70 кДж/моль',rc:'#f0f0f0',anim:'precipitate',desc:'Белый СТУДЕНИСТЫЙ осадок! Амфотерный — растворяется в избытке!',med:'Al(OH)₃ — антацид (Алмагель, Маалокс, Фосфалюгель).',cond:'t° комнатная',products:['Al(OH)₃','NaCl'],danger:0,xp:25},
    {r:['ZnSO4','NaOH'],eq:'ZnSO₄ + 2NaOH → Zn(OH)₂↓ + Na₂SO₄',name:'Белый Zn(OH)₂ ⚪',type:'neutral',energy:'-55 кДж/моль',rc:'#ffffff',anim:'precipitate',desc:'Белый осадок! АМФОТЕРНЫЙ — растворяется в избытке NaOH!',med:'Zn(OH)₂ — вяжущее, антисептическое действие.',cond:'t° комнатная',products:['Zn(OH)₂','Na₂SO₄'],danger:0,xp:20},
    {r:['MgSO4','NaOH'],eq:'MgSO₄ + 2NaOH → Mg(OH)₂↓ + Na₂SO₄',name:'Молоко магнезии ⚪',type:'neutral',energy:'-50 кДж/моль',rc:'#ffffff',anim:'precipitate',desc:'Белый аморфный осадок — «молоко магнезии»!',med:'Mg(OH)₂ — антацид и слабительное (Маалокс, Милк оф магнезия).',cond:'t° комнатная',products:['Mg(OH)₂','Na₂SO₄'],danger:0,xp:20},

    // ═══════════════════════════════════════
    // ОКСИДЫ + КИСЛОТЫ/ЩЁЛОЧИ
    // ═══════════════════════════════════════
    {r:['Fe2O3','HCl'],eq:'Fe₂O₃ + 6HCl → 2FeCl₃ + 3H₂O',name:'Ржавчина + HCl 🟤',type:'exo',energy:'-130 кДж',rc:'#8B4513',anim:'heat',desc:'Бурый порошок (ржавчина) растворяется → ЖЁЛТО-БУРЫЙ раствор!',med:'FeCl₃ — гемостатик (кровоостанавливающее).',cond:'Нагрев',products:['FeCl₃','H₂O'],danger:0,xp:15},
    {r:['Fe2O3','H2SO4'],eq:'Fe₂O₃ + 3H₂SO₄ → Fe₂(SO₄)₃ + 3H₂O',name:'Ржавчина + серная',type:'exo',energy:'-135 кДж',rc:'#CD853F',anim:'heat',desc:'Оксид растворяется → жёлтый раствор сульфата железа(III)!',med:'Fe₂(SO₄)₃ — коагулянт для очистки питьевой воды.',cond:'Нагрев',products:['Fe₂(SO₄)₃','H₂O'],danger:0,xp:15},
    {r:['MnO2','HCl'],eq:'MnO₂ + 4HCl → MnCl₂ + Cl₂↑ + 2H₂O',name:'Получение хлора! ☠️🟢',type:'exo',energy:'-120 кДж',rc:'#b8e986',anim:'smoke',desc:'Жёлто-зелёный ЯДОВИТЫЙ газ Cl₂! Запах «бассейна»! Лабораторный метод.',med:'Cl₂ — дезинфекция воды. В Первую мировую — хим. оружие.',cond:'Нагрев, конц. HCl',products:['MnCl₂','Cl₂','H₂O'],danger:4,xp:45},
    {r:['SiO2','NaOH'],eq:'SiO₂ + 2NaOH → Na₂SiO₃ + H₂O',name:'Кварц + щёлочь → жидкое стекло',type:'exo',energy:'-80 кДж',rc:'#e8e8f0',anim:'heat',desc:'Кварц растворяется в горячей щёлочи! «Жидкое стекло»!',med:'Na₂SiO₃ — хирургический клей, силикатный цемент.',cond:'Плавление',products:['Na₂SiO₃','H₂O'],danger:1,xp:25},
    {r:['SiO2','HF'],eq:'SiO₂ + 4HF → SiF₄↑ + 2H₂O',name:'Травление стекла! 🔬☠️',type:'exo',energy:'-190 кДж',rc:'#f0f0f0',anim:'smoke',desc:'HF — ЕДИНСТВЕННАЯ кислота, растворяющая стекло! Травление!',med:'⚠️ HF — ОПАСНЕЙШИЕ ожоги! Проникает сквозь кожу в кости!',cond:'t° комнатная',products:['SiF₄','H₂O'],danger:5,xp:60},
    {r:['CaO','CO2'],eq:'CaO + CO₂ → CaCO₃',name:'Твердение извести',type:'exo',energy:'-178 кДж/моль',rc:'#f8f8f0',anim:'heat',desc:'Известь «твердеет» на воздухе — поглощает CO₂ → мрамор!',med:'Принцип затвердевания строительных растворов.',cond:'t° комнатная',products:['CaCO₃'],danger:0,xp:15},
    {r:['CaO','HCl'],eq:'CaO + 2HCl → CaCl₂ + H₂O',name:'Негашёная известь + HCl',type:'exo',energy:'-195 кДж/моль',rc:'#f0f0f0',anim:'boil',desc:'СИЛЬНЫЙ нагрев! CaO бурно реагирует с кислотой!',med:'CaCl₂ — при аллергии, гипокальциемии (внутривенно).',cond:'t° комнатная',products:['CaCl₂','H₂O'],danger:1,xp:15},
    {r:['Cr2O3','HCl'],eq:'Cr₂O₃ + 6HCl → 2CrCl₃ + 3H₂O',name:'Оксид хрома + HCl 🟢',type:'exo',energy:'-100 кДж',rc:'#228B22',anim:'heat',desc:'Зелёный порошок растворяется → тёмно-зелёный раствор CrCl₃!',med:'Cr₂O₃ — безопасный зелёный пигмент (в отличие от CrO₃!).',cond:'Нагрев',products:['CrCl₃','H₂O'],danger:0,xp:15},
    {r:['Cr2O3','NaOH'],eq:'Cr₂O₃ + 2NaOH → 2NaCrO₂ + H₂O',name:'Cr₂O₃ амфотерный! 🟢',type:'exo',energy:'-60 кДж',rc:'#228B22',anim:'heat',desc:'АМФОТЕРНЫЙ оксид! Растворяется и в щёлочи! Хромит натрия.',med:'Хроматы — важны в аналитической химии.',cond:'Плавление',products:['NaCrO₂','H₂O'],danger:1,xp:25},
    {r:['P2O5','NaOH'],eq:'P₂O₅ + 6NaOH → 2Na₃PO₄ + 3H₂O',name:'P₂O₅ + щёлочь',type:'exo',energy:'-300 кДж',rc:'#f0f0f0',anim:'boil',desc:'БУРНАЯ реакция! P₂O₅ — сильнейший осушитель!',med:'Фосфаты важны для энергетики клетки (АТФ, ДНК).',cond:'t° комнатная',products:['Na₃PO₄','H₂O'],danger:2,xp:25},
    {r:['SO2','NaOH'],eq:'SO₂ + 2NaOH → Na₂SO₃ + H₂O',name:'Улавливание SO₂',type:'exo',energy:'-90 кДж/моль',rc:'#f0f0f0',anim:'heat',desc:'Щёлочь ПОГЛОЩАЕТ ядовитый сернистый газ! Очистка выбросов.',med:'Na₂SO₃ — консервант E221 (сухофрукты, вино).',cond:'t° комнатная',products:['Na₂SO₃','H₂O'],danger:0,xp:15},

    // ═══════════════════════════════════════
    // ОРГАНИКА (новые)
    // ═══════════════════════════════════════
    {r:['C6H6','HNO3'],eq:'C₆H₆ + HNO₃ → C₆H₅NO₂ + H₂O',name:'Нитробензол 🟡 (миндаль)',type:'exo',energy:'-117 кДж/моль',rc:'#FFD700',anim:'heat',desc:'Нитрование бензола! Жёлтая маслянистая жидкость, запах миндаля!',med:'⚠️ Нитробензол ЯДОВИТ! Вызывает метгемоглобинемию.',cond:'Кат. H₂SO₄, нагрев',products:['C₆H₅NO₂','H₂O'],danger:3,xp:35},
    {r:['CH3OH','Na'],eq:'2CH₃OH + 2Na → 2CH₃ONa + H₂↑',name:'Метанол + натрий',type:'exo',energy:'-85 кДж/моль',rc:'#f0e8d8',anim:'bubble',desc:'Натрий медленно растворяется в метаноле. Метилат натрия.',med:'⚠️ Метанол СМЕРТЕЛЕН! 10 мл → слепота, 30 мл → смерть!',cond:'t° комнатная',products:['CH₃ONa','H₂'],danger:3,xp:30},
    {r:['C6H5OH','NaOH'],eq:'C₆H₅OH + NaOH → C₆H₅ONa + H₂O',name:'Фенол + NaOH → фенолят',type:'exo',energy:'-45 кДж/моль',rc:'#f0f0f0',anim:'heat',desc:'Фенол растворяется в щёлочи! Кислотные свойства фенола!',med:'Фенол — старейший антисептик (Листер, 1865).',cond:'t° комнатная',products:['C₆H₅ONa','H₂O'],danger:1,xp:20},
    {r:['C6H5OH','Br'],eq:'C₆H₅OH + 3Br₂ → C₆H₂Br₃OH↓ + 3HBr',name:'Трибромфенол ⚪↓',type:'exo',energy:'-150 кДж',rc:'#ffffff',anim:'precipitate',desc:'БЕЛЫЙ осадок трибромфенола! КАЧЕСТВЕННАЯ реакция на фенол!',med:'Определение фенола в воде и сточных водах.',cond:'t° комнатная',products:['C₆H₂Br₃OH','HBr'],danger:2,xp:30},
    {r:['C2H5OH','CH3COOH'],eq:'C₂H₅OH + CH₃COOH ⇌ CH₃COOC₂H₅ + H₂O',name:'Эфир фруктовый! 🍎',type:'neutral',energy:'-10 кДж/моль',rc:'#f0f0e0',anim:'heat',desc:'Этилацетат — приятный ФРУКТОВЫЙ запах! Эстерификация!',med:'Этилацетат — растворитель для лаков. Ароматизатор.',cond:'Кат. H₂SO₄, нагрев',products:['CH₃COOC₂H₅','H₂O'],danger:0,xp:25},
    {r:['HCOOH','NaOH'],eq:'HCOOH + NaOH → HCOONa + H₂O',name:'Муравьиная + NaOH',type:'exo',energy:'-55 кДж/моль',rc:'#f0f0f0',anim:'heat',desc:'Нейтрализация муравьиной кислоты. Формиат натрия.',med:'HCOOH — жжение при укусе муравьёв и крапивы!',cond:'t° комнатная',products:['HCOONa','H₂O'],danger:0,xp:10},
    {r:['C6H6','Cl'],eq:'C₆H₆ + Cl₂ → C₆H₅Cl + HCl',name:'Хлорбензол',type:'exo',energy:'-50 кДж/моль',rc:'#b8e986',anim:'smoke',desc:'Замещение H на Cl в бензоле. Нужен катализатор AlCl₃!',med:'Хлорбензол — растворитель в фармсинтезе.',cond:'Кат. AlCl₃',products:['C₆H₅Cl','HCl'],danger:2,xp:30},
    {r:['C2H2','Br'],eq:'C₂H₂ + 2Br₂ → C₂H₂Br₄',name:'Ацетилен + бром 🟡→⚪',type:'exo',energy:'-210 кДж/моль',rc:'#f0f0f0',anim:'decolor',desc:'Бром ОБЕСЦВЕЧИВАЕТСЯ! ТРОЙНАЯ связь ≡ присоединяет 2 молекулы Br₂!',med:'Качественная реакция на тройную C≡C связь.',cond:'t° комнатная',products:['C₂H₂Br₄'],danger:2,xp:30},
    {r:['glycerol','Na'],eq:'2C₃H₅(OH)₃ + 6Na → 2C₃H₅(ONa)₃ + 3H₂↑',name:'Глицерин + натрий 🫧',type:'exo',energy:'-180 кДж',rc:'#f0e8d8',anim:'bubble',desc:'Натрий реагирует со всеми тремя OH-группами! Пузырьки H₂!',med:'Глицерин — 3 гидроксила → 3 атома Na. Многоатомный спирт.',cond:'Нагрев',products:['Глицерат Na','H₂'],danger:2,xp:30},

    // ═══════════════════════════════════════
    // АМФОТЕРНОСТЬ
    // ═══════════════════════════════════════
    {r:['Al','NaOH'],eq:'2Al + 2NaOH + 2H₂O → 2NaAlO₂ + 3H₂↑',name:'Алюминий в щёлочи! 🫧',type:'exo',energy:'-420 кДж',rc:'#f0f0f8',anim:'bubble',desc:'Алюминий РАСТВОРЯЕТСЯ в щёлочи! Бурный H₂! Амфотерный металл!',med:'Нельзя хранить щелочные ЛС в алюминиевой таре!',cond:'Нагрев',products:['NaAlO₂','H₂'],danger:1,xp:30},
    {r:['Zn','NaOH'],eq:'Zn + 2NaOH → Na₂ZnO₂ + H₂↑',name:'Цинк в щёлочи! 🫧',type:'exo',energy:'-200 кДж',rc:'#f0f0f8',anim:'bubble',desc:'Цинк — АМФОТЕРНЫЙ! Растворяется и в кислоте, и в щёлочи!',med:'Цинковые мази — заживление ран, опрелости.',cond:'Нагрев',products:['Na₂ZnO₂','H₂'],danger:1,xp:30},

    // ═══════════════════════════════════════
    // ИНТЕРЕСНЫЕ И АНАЛИТИЧЕСКИЕ
    // ═══════════════════════════════════════
    {r:['K2Cr2O7','C2H5OH'],eq:'K₂Cr₂O₇ + C₂H₅OH + H₂SO₄ → Cr₂(SO₄)₃ + CH₃CHO + ...',name:'Алкотестер! 🍺→🟢',type:'exo',energy:'-250 кДж',rc:'#228B22',anim:'color',desc:'ОРАНЖЕВЫЙ → ЗЕЛЁНЫЙ! Cr⁶⁺ → Cr³⁺! Принцип АЛКОТЕСТЕРА!',med:'Определение этанола в крови! Принцип дыхательного теста.',cond:'Кислая среда',products:['Cr₂(SO₄)₃','CH₃CHO'],danger:2,xp:40},
    {r:['H2S','SO2'],eq:'2H₂S + SO₂ → 3S↓ + 2H₂O',name:'Сера из газов 🟡',type:'exo',energy:'-234 кДж',rc:'#FFD700',anim:'precipitate',desc:'ДВА ядовитых газа → безвредная СЕРА! Природный процесс (вулканы).',med:'H₂S и SO₂ — токсичны, но вместе нейтрализуются.',cond:'t° комнатная',products:['S','H₂O'],danger:2,xp:30},
    {r:['NH3','Cl'],eq:'8NH₃ + 3Cl₂ → N₂ + 6NH₄Cl',name:'Аммиак + хлор 💨',type:'exo',energy:'-462 кДж/моль',rc:'#f0f0f0',anim:'smoke',desc:'БЕЛЫЙ дым NH₄Cl! При избытке Cl₂ — крайне опасно!',med:'Утечка хлора + аммиака — промышленная авария!',cond:'Газовая фаза',products:['N₂','NH₄Cl'],danger:4,xp:40},
    {r:['F','H2O'],eq:'2F₂ + 2H₂O → 4HF + O₂',name:'Фтор + вода! 💥🔥',type:'exo',energy:'-650 кДж/моль',rc:'#e8ffa0',anim:'explode',desc:'ФТОР ПОДЖИГАЕТ ВОДУ! Самый сильный окислитель во Вселенной!',med:'⚠️ HF — тяжелейшие глубокие ожоги, проникает до костей!',cond:'МГНОВЕННО!',products:['HF','O₂'],danger:5,xp:70},
    {r:['K','Cl'],eq:'2K + Cl₂ → 2KCl',name:'Калий + хлор 💥🟣',type:'exo',energy:'-872 кДж/моль',rc:'#9370DB',anim:'explode',desc:'ЯРКАЯ ФИОЛЕТОВАЯ вспышка! Калий горит в хлоре!',med:'KCl — препарат калия (Панангин, Аспаркам).',cond:'Поджиг',products:['KCl'],danger:4,xp:50},
    {r:['Cu','S'],eq:'2Cu + S → Cu₂S',name:'Медь + сера ⚫',type:'exo',energy:'-79 кДж/моль',rc:'#1a1a1a',anim:'burn',desc:'Медь + сера → чёрный сульфид меди(I) Cu₂S!',med:'Cu₂S — минерал халькозин. Cu — микроэлемент.',cond:'Нагрев',products:['Cu₂S'],danger:1,xp:20},
    {r:['Ag','H2S'],eq:'4Ag + 2H₂S + O₂ → 2Ag₂S + 2H₂O',name:'Почернение серебра ⚫',type:'exo',energy:'-60 кДж',rc:'#1a1a1a',anim:'coat',desc:'Серебро ЧЕРНЕЕТ! Плёнка Ag₂S на поверхности!',med:'Серебряная ложка темнеет от яичного желтка (H₂S).',cond:'t° комнатная, O₂',products:['Ag₂S','H₂O'],danger:0,xp:25},
    {r:['NaHCO3','H2SO4'],eq:'2NaHCO₃ + H₂SO₄ → Na₂SO₄ + 2H₂O + 2CO₂↑',name:'Сода + серная 🫧',type:'exo',energy:'-25 кДж',rc:'#f0f0f0',anim:'fizz',desc:'Бурное вспенивание! Фонтан пузырьков CO₂!',med:'Сода — антацид (снимает изжогу). Буферная система.',cond:'t° комнатная',products:['Na₂SO₄','H₂O','CO₂'],danger:0,xp:15},
    {r:['Na2CO3','H2SO4'],eq:'Na₂CO₃ + H₂SO₄ → Na₂SO₄ + H₂O + CO₂↑',name:'Кальц. сода + серная 🫧',type:'exo',energy:'-28 кДж',rc:'#f0f0f0',anim:'fizz',desc:'Шипение! CO₂ вытесняется сильной кислотой!',med:'Na₂CO₃ — стиральная (кальцинированная) сода.',cond:'t° комнатная',products:['Na₂SO₄','H₂O','CO₂'],danger:0,xp:15},
    {r:['NH4Cl','Ca_OH_2'],eq:'2NH₄Cl + Ca(OH)₂ → CaCl₂ + 2NH₃↑ + 2H₂O',name:'Получение аммиака! 💨',type:'endo',energy:'+15 кДж',rc:'#e0ffe0',anim:'smoke',desc:'Резкий запах NH₃! Лабораторный способ получения аммиака!',med:'NH₃ (нашатырный спирт) — при обмороках.',cond:'Нагрев',products:['CaCl₂','NH₃','H₂O'],danger:1,xp:25},

    // ═══════════════════════════════════════
    // ГАЛОГЕНЫ — ВЫТЕСНЕНИЕ
    // ═══════════════════════════════════════
    {r:['KI','Cl'],eq:'2KI + Cl₂ → 2KCl + I₂',name:'Хлор вытесняет йод! 🟤',type:'exo',energy:'-185 кДж/моль',rc:'#4a0080',anim:'color',desc:'Хлор ВЫТЕСНЯЕТ йод из соли! Раствор БУРЕЕТ от I₂!',med:'Ряд активности: F₂ > Cl₂ > Br₂ > I₂.',cond:'t° комнатная',products:['KCl','I₂'],danger:1,xp:25},
    {r:['KBr','Cl'],eq:'2KBr + Cl₂ → 2KCl + Br₂',name:'Хлор вытесняет бром! 🟠',type:'exo',energy:'-95 кДж/моль',rc:'#8B0000',anim:'color',desc:'Хлор ВЫТЕСНЯЕТ бром! Раствор КРАСНЕЕТ от Br₂!',med:'Cl₂ активнее Br₂ — более сильный окислитель.',cond:'t° комнатная',products:['KCl','Br₂'],danger:1,xp:25},
    {r:['KI','Br'],eq:'2KI + Br₂ → 2KBr + I₂',name:'Бром вытесняет йод! 🟤',type:'exo',energy:'-90 кДж/моль',rc:'#4a0080',anim:'color',desc:'Бром ВЫТЕСНЯЕТ йод! Раствор буреет!',med:'Br₂ активнее I₂. Электроотрицательность убывает в группе.',cond:'t° комнатная',products:['KBr','I₂'],danger:1,xp:25},

    // ═══════════════════════════════════════
    // ВЫТЕСНЕНИЕ ЛЕТУЧИХ КИСЛОТ
    // ═══════════════════════════════════════
    {r:['NaCl','H2SO4'],eq:'NaCl + H₂SO₄(конц.) → NaHSO₄ + HCl↑',name:'Получение HCl! 💨',type:'exo',energy:'-72 кДж/моль',rc:'#f0f0f0',anim:'smoke',desc:'Летучая HCl вытесняется нелетучей H₂SO₄ при нагревании!',med:'HCl — соляная кислота вашего желудка (pH 1-2)!',cond:'Нагрев, конц.',products:['NaHSO₄','HCl'],danger:2,xp:30},
    {r:['NaNO3','H2SO4'],eq:'NaNO₃ + H₂SO₄(конц.) → NaHSO₄ + HNO₃↑',name:'Получение HNO₃! 💨',type:'exo',energy:'-65 кДж/моль',rc:'#fff8d0',anim:'smoke',desc:'Летучая HNO₃ вытесняется! Бурые пары NO₂!',med:'HNO₃ — сильнейший окислитель.',cond:'Нагрев, конц.',products:['NaHSO₄','HNO₃'],danger:3,xp:35},

    // ═══════════════════════════════════════
    // РЕАКЦИИ РЕДКИХ ЭЛЕМЕНТОВ
    // ═══════════════════════════════════════
    {r:['Cd','HCl'],eq:'Cd + 2HCl → CdCl₂ + H₂↑',name:'Кадмий + HCl ☠️',type:'exo',energy:'-65 кДж/моль',rc:'#e0e0e0',anim:'bubble',desc:'Кадмий медленно растворяется. ⚠️ Крайне ядовит!',med:'⚠️ Cd — канцероген! Поражает почки (болезнь итай-итай).',cond:'Нагрев',products:['CdCl₂','H₂'],danger:3,xp:30},
    {r:['Sb','Cl'],eq:'2Sb + 3Cl₂ → 2SbCl₃',name:'Сурьма + хлор 💨',type:'exo',energy:'-382 кДж/моль',rc:'#f0f0f0',anim:'smoke',desc:'Сурьма горит в хлоре — белый дым SbCl₃!',med:'Sb — в лекарствах от лейшманиоза (Пентостам).',cond:'Нагрев',products:['SbCl₃'],danger:2,xp:25},
    {r:['Sn','Cl'],eq:'Sn + 2Cl₂ → SnCl₄',name:'Олово в хлоре',type:'exo',energy:'-511 кДж/моль',rc:'#f0f0f0',anim:'smoke',desc:'Олово горит в хлоре — дымящаяся жидкость SnCl₄!',med:'Sn — олово (хлорид олова в пищепроме).',cond:'Нагрев',products:['SnCl₄'],danger:2,xp:25},
    {r:['La','HCl'],eq:'2La + 6HCl → 2LaCl₃ + 3H₂↑',name:'Лантан + HCl (редкоземельный!)',type:'exo',energy:'-700 кДж',rc:'#f0f0f0',anim:'bubble',desc:'Редкоземельный металл! Активно растворяется!',med:'La₂(CO₃)₃ — препарат при гиперфосфатемии (Фосренол).',cond:'t° комнатная',products:['LaCl₃','H₂'],danger:0,xp:20},

    // ═══════════════════════════════════════
    // КАЧЕСТВЕННЫЕ РЕАКЦИИ
    // ═══════════════════════════════════════
    {r:['KSCN','FeCl3'],eq:'FeCl₃ + 3KSCN → Fe(SCN)₃ + 3KCl',name:'КРОВАВО-КРАСНЫЙ! 🔴',type:'neutral',energy:'-20 кДж',rc:'#DC143C',anim:'color',desc:'ЯРКО-КРАСНЫЙ (кровавый) цвет! Качественная реакция на Fe³⁺!',med:'Определение Fe³⁺ в крови и лекарственных препаратах.',cond:'t° комнатная',products:['Fe(SCN)₃','KCl'],danger:0,xp:30},
    {r:['CuSO4','KOH'],eq:'CuSO₄ + 2KOH → Cu(OH)₂↓ + K₂SO₄',name:'Cu(OH)₂ (биуретовая) 🔵',type:'neutral',energy:'-63 кДж/моль',rc:'#4169E1',anim:'precipitate',desc:'Голубой осадок Cu(OH)₂! Реагент для биуретовой реакции!',med:'Cu(OH)₂ + белок → ФИОЛЕТОВЫЙ цвет (определение белка).',cond:'t° комнатная',products:['Cu(OH)₂','K₂SO₄'],danger:0,xp:20},
    {r:['Ca_OH_2','Na2CO3'],eq:'Ca(OH)₂ + Na₂CO₃ → CaCO₃↓ + 2NaOH',name:'Каустификация! ⚪',type:'neutral',energy:'-30 кДж/моль',rc:'#ffffff',anim:'precipitate',desc:'Получение NaOH из Na₂CO₃! Белый осадок CaCO₃!',med:'Промышленное получение каустической соды (NaOH).',cond:'t° комнатная',products:['CaCO₃','NaOH'],danger:0,xp:25},

    // ═══════════════════════════════════════
    // КАРБИД, ТИОСУЛЬФАТ
    // ═══════════════════════════════════════
    {r:['CaC2','H2O'],eq:'CaC₂ + 2H₂O → Ca(OH)₂ + C₂H₂↑',name:'Карбид + вода! 🫧🔥',type:'exo',energy:'-126 кДж/моль',rc:'#f0f0e8',anim:'fizz',desc:'Карбид ШИПИТ! Ацетилен (C₂H₂) — горючий газ с резким запахом!',med:'C₂H₂ использовался в старых хирургических лампах.',cond:'t° комнатная',products:['Ca(OH)₂','C₂H₂'],danger:2,xp:30},
    {r:['Na2S2O3','I'],eq:'2Na₂S₂O₃ + I₂ → Na₂S₄O₆ + 2NaI',name:'Йодометрия! 🟤→⚪',type:'neutral',energy:'-30 кДж',rc:'#f0f0f0',anim:'decolor',desc:'Йод ОБЕСЦВЕЧИВАЕТСЯ! Точка эквивалентности! Важнейшее титрование!',med:'Йодометрия — количественный анализ препаратов.',cond:'t° комнатная',products:['Na₂S₄O₆','NaI'],danger:0,xp:30},
    {r:['Na2S2O3','HCl'],eq:'Na₂S₂O₃ + 2HCl → 2NaCl + S↓ + SO₂↑ + H₂O',name:'Тиосульфат + кислота 🟡💨',type:'exo',energy:'-50 кДж',rc:'#FFD700',anim:'precipitate',desc:'Раствор МУТНЕЕТ — жёлтая СЕРА! SO₂ пахнет! Классика кинетики!',med:'Na₂S₂O₃ — АНТИДОТ при отравлении цианидами и ртутью!',cond:'t° комнатная',products:['NaCl','S','SO₂','H₂O'],danger:1,xp:25},

    // ═══════════════════════════════════════
    // «НЕ РЕАГИРУЕТ» — ОБУЧАЮЩИЕ
    // ═══════════════════════════════════════
    {r:['Ag','HCl'],eq:'Ag + HCl → НЕ РЕАГИРУЕТ',name:'Серебро + HCl ❌',type:'neutral',energy:'0',rc:'#e8e8e8',anim:'none',desc:'Серебро НЕ растворяется! Стоит ПОСЛЕ H₂ в ряду напряжений!',med:'Ag менее активен, чем водород. Нужна HNO₃!',cond:'Не реагирует',products:['Ag'],danger:0,xp:15},
    {r:['Cu','HCl'],eq:'Cu + HCl → НЕ РЕАГИРУЕТ',name:'Медь + HCl ❌',type:'neutral',energy:'0',rc:'#b87333',anim:'none',desc:'Медь НЕ растворяется в HCl! Нужен ОКИСЛИТЕЛЬ (HNO₃)!',med:'Cu стоит после H₂ в ряду активности металлов.',cond:'Не реагирует',products:['Cu'],danger:0,xp:15},
    {r:['Pt','HCl'],eq:'Pt + HCl → НЕ РЕАГИРУЕТ',name:'Платина + HCl ❌',type:'neutral',energy:'0',rc:'#d8d8d0',anim:'none',desc:'Благородный металл! Растворяется ТОЛЬКО в царской водке (HCl+HNO₃)!',med:'Pt — цисплатин (противоопухолевая химиотерапия).',cond:'Не реагирует',products:['Pt'],danger:0,xp:15}
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
    {id:'disc50',icon:'🔬',name:'Академик',desc:'Открой 50 уникальных реакций',check:()=>discoveredReactions.size>=50},
    {id:'disc80',icon:'📚',name:'Профессионал',desc:'Открой 80 уникальных реакций',check:()=>discoveredReactions.size>=80},
    {id:'disc100',icon:'🏅',name:'Легенда химии',desc:'Открой 100 уникальных',check:()=>discoveredReactions.size>=100},
    {id:'disc150',icon:'💎',name:'Мастер всех реакций',desc:'Открой 150 уникальных',check:()=>discoveredReactions.size>=150},
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
    const scrollTop=c.scrollTop;
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
    c.scrollTop=scrollTop;
}

function bindSearch(){
    const i=document.getElementById('chem-search-input');
    if(!i)return;
    i.addEventListener('input',function(){searchQuery=this.value.toLowerCase().trim();renderShelf();});
}

var _addLock=false;
function addToTable(id){
    if(_addLock)return;
    _addLock=true;setTimeout(function(){_addLock=false;},300);
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

