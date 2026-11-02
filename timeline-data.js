/* Bible Timeline data — compiled for this reader.
 *
 * Dates are approximate. Two dating systems are provided:
 *   c = conventional scholarly dates (early-date Exodus, c. 1446 BC)
 *   u = Ussher's chronology (as printed on Adams' 1881 chart, public domain)
 * BC years are negative, AD years positive (no year 0 — treated linearly).
 * A date can be a number (single moment) or [start, end] (a span).
 * `c = null` means the event has no conventional date; the Ussher date is
 * shown and marked "traditional". Where `u` is omitted it equals `c`.
 *
 * Notes are original summaries. To add your own data (e.g. from your Youth
 * Quest study notes), push more entries onto TL_EVENTS / adjust TL_BOOKS
 * from a separate file loaded after this one.
 */
(function () {
  const LANES = [
    { id: 'orig',  name: 'Origins & Patriarchs' },
    { id: 'exod',  name: 'Exodus to Judges' },
    { id: 'mon',   name: 'Kingdoms & Return' },
    { id: 'proph', name: 'Prophets' },
    { id: 'world', name: 'World Powers' },
    { id: 'nt',    name: 'New Testament' },
  ];

  const EV = [];
  function X(lane, label, c, u, ref, note) {
    EV.push({ lane, label, c, u: u === undefined ? c : u, ref: ref || null, note: note || '' });
  }

  // ── Origins & Patriarchs ──────────────────────────────────────────────────
  X('orig', 'Creation', null, -4004, ['Genesis', 1, 1], 'God creates the heavens, the earth and humankind. No conventional date; Ussher placed it at 4004 BC.');
  X('orig', 'The Fall', null, -4004, ['Genesis', 3, 6], 'Adam and Eve disobey, and sin and death enter the world.');
  X('orig', 'The Flood', null, -2348, ['Genesis', 7, 11], 'Noah, his family and the animals are saved in the ark while the earth is flooded.');
  X('orig', 'Tower of Babel', null, -2247, ['Genesis', 11, 9], 'Languages are confused and people scatter across the earth.');
  X('orig', 'Abraham called', -2091, -1921, ['Genesis', 12, 1], 'God calls Abram to leave Haran and promises him a land, a nation and a blessing for all peoples.');
  X('orig', 'Isaac born', -2066, -1896, ['Genesis', 21, 2], 'The son of promise is born to Abraham and Sarah in their old age.');
  X('orig', 'Jacob born', -2006, -1836, ['Genesis', 25, 26], 'Twin of Esau; later renamed Israel, father of the twelve tribes.');
  X('orig', 'Joseph sold into Egypt', -1898, -1728, ['Genesis', 37, 28], 'Joseph\'s brothers sell him to traders heading for Egypt.');
  X('orig', 'Joseph made governor', -1885, -1715, ['Genesis', 41, 41], 'Pharaoh puts Joseph in charge of Egypt after he interprets the dreams.');
  X('orig', 'Jacob\'s family to Egypt', -1876, -1706, ['Genesis', 46, 6], 'Jacob and his household move to Egypt during the famine.');
  X('orig', 'Joseph dies', -1805, -1635, ['Genesis', 50, 26], 'Joseph dies in Egypt after making Israel promise to carry his bones to Canaan.');

  // ── Exodus to Judges ──────────────────────────────────────────────────────
  X('exod', 'Moses born', -1526, -1571, ['Exodus', 2, 2], 'Born to a Hebrew mother, hidden in a basket and raised in Pharaoh\'s household.');
  X('exod', 'Exodus & Passover', -1446, -1491, ['Exodus', 12, 31], 'Israel leaves Egypt after the plagues and crosses the sea.');
  X('exod', 'Law given at Sinai', -1445, -1491, ['Exodus', 20, 1], 'The Ten Commandments and the covenant are given at the mountain.');
  X('exod', 'Tabernacle set up', -1445, -1490, ['Exodus', 40, 17], 'The tent of meeting is erected on the first day of the second year.');
  X('exod', 'Wilderness years', [-1445, -1406], [-1491, -1451], ['Numbers', 14, 33], 'A generation wanders for forty years after refusing to enter the land.');
  X('exod', 'Moses dies', -1406, -1451, ['Deuteronomy', 34, 5], 'Moses sees the land from Mount Nebo and dies; Joshua leads next.');
  X('exod', 'Crossing the Jordan', -1406, -1451, ['Joshua', 3, 17], 'Israel crosses on dry ground and camps at Gilgal.');
  X('exod', 'Jericho falls', -1406, -1451, ['Joshua', 6, 20], 'The walls fall and Israel\'s conquest of Canaan begins.');
  X('exod', 'Conquest & settlement', [-1406, -1380], [-1451, -1425], ['Joshua', 11, 23], 'Joshua leads the campaigns, and the land is divided among the tribes.');
  X('exod', 'Judges period', [-1380, -1050], [-1425, -1095], ['Judges', 2, 16], 'Cycles of disobedience, oppression and deliverance under judges such as Deborah, Gideon and Samson.');
  X('exod', 'Ruth', -1100, undefined, ['Ruth', 1, 16], 'A Moabite widow stays loyal to Naomi and becomes an ancestor of David. Dated loosely to the time of the judges.');

  // ── Kingdoms & Return ─────────────────────────────────────────────────────
  X('mon', 'Saul reigns', [-1050, -1010], [-1095, -1056], ['1 Samuel', 11, 15], 'Israel\'s first king, anointed by Samuel and crowned at Gilgal.');
  X('mon', 'David and Goliath', -1025, -1063, ['1 Samuel', 17, 50], 'The young shepherd defeats the Philistine champion with a sling.');
  X('mon', 'David reigns', [-1010, -970], [-1055, -1015], ['2 Samuel', 5, 4], 'King over Judah, then all Israel; makes Jerusalem the capital.');
  X('mon', 'Solomon reigns', [-970, -931], [-1015, -975], ['1 Kings', 11, 42], 'A reign of wisdom, building and wealth, ending in drift toward foreign gods.');
  X('mon', 'Temple dedicated', -959, -1004, ['1 Kings', 8, 63], 'Solomon dedicates the first temple in Jerusalem.');
  X('mon', 'Kingdom divides', -931, -975, ['1 Kings', 12, 20], 'The ten northern tribes follow Jeroboam; Judah stays with Rehoboam.');
  X('mon', 'Northern kingdom (Israel)', [-931, -722], [-975, -721], ['1 Kings', 12, 20], 'Capital Samaria. Ruled by a series of dynasties, all judged evil in Kings.');
  X('mon', 'Southern kingdom (Judah)', [-931, -586], [-975, -588], ['1 Kings', 14, 21], 'Capital Jerusalem. Descendants of David reign throughout.');
  X('mon', 'Fall of Samaria', -722, -721, ['2 Kings', 17, 6], 'Assyria captures Samaria and deports much of the northern kingdom.');
  X('mon', 'Hezekiah reigns', [-715, -686], [-726, -698], ['2 Kings', 18, 1], 'A reforming king of Judah; Jerusalem is spared from Sennacherib.');
  X('mon', 'Josiah\'s reform', -622, -623, ['2 Kings', 22, 8], 'The book of the law is found in the temple and Judah renews the covenant.');
  X('mon', 'Jerusalem falls', -586, -588, ['2 Kings', 25, 9], 'Babylon burns the temple and city and deports the people.');
  X('mon', 'Babylonian exile', [-605, -538], [-606, -536], ['Jeremiah', 25, 11], 'Seventy years of exile foretold by Jeremiah.');
  X('mon', 'Cyrus\'s decree', -538, -536, ['Ezra', 1, 1], 'The Persian king lets the Jews return and rebuild the temple.');
  X('mon', 'Second temple finished', -516, -515, ['Ezra', 6, 15], 'The rebuilt temple is completed in the reign of Darius.');
  X('mon', 'Ezra returns', -458, -457, ['Ezra', 7, 7], 'Ezra leads a second group home and teaches the law.');
  X('mon', 'Wall of Jerusalem rebuilt', -445, -445, ['Nehemiah', 6, 15], 'Nehemiah finishes the wall in fifty-two days despite opposition.');

  // ── Prophets (ministry periods, approximate) ───────────────────────────────
  X('proph', 'Elijah', [-870, -848], undefined, ['1 Kings', 17, 1], 'Confronts Ahab and the prophets of Baal at Mount Carmel.');
  X('proph', 'Elisha', [-855, -800], undefined, ['2 Kings', 2, 9], 'Takes up Elijah\'s mantle; many miracles recorded.');
  X('proph', 'Jonah', [-780, -760], undefined, ['Jonah', 1, 1], 'Sent to Nineveh; resists, then preaches and the city repents.');
  X('proph', 'Amos', [-760, -750], undefined, ['Amos', 1, 1], 'A shepherd from Tekoa who calls the north to justice.');
  X('proph', 'Hosea', [-755, -715], undefined, ['Hosea', 1, 1], 'His marriage pictures God\'s faithful love for unfaithful Israel.');
  X('proph', 'Isaiah', [-740, -681], undefined, ['Isaiah', 6, 1], 'Prophet in Jerusalem through four kings of Judah.');
  X('proph', 'Micah', [-735, -700], undefined, ['Micah', 1, 1], 'Contemporary of Isaiah; foretells the ruler from Bethlehem.');
  X('proph', 'Nahum', -650, undefined, ['Nahum', 1, 1], 'Announces the coming fall of Nineveh.');
  X('proph', 'Zephaniah', [-635, -625], undefined, ['Zephaniah', 1, 1], 'Warns of the day of the Lord in Josiah\'s time.');
  X('proph', 'Jeremiah', [-627, -580], undefined, ['Jeremiah', 1, 1], 'Prophesies through the last decades of Judah and the fall of Jerusalem.');
  X('proph', 'Habakkuk', -605, undefined, ['Habakkuk', 1, 1], 'Wrestles with God over injustice and learns to live by faith.');
  X('proph', 'Daniel', [-605, -536], undefined, ['Daniel', 1, 1], 'Serves in the courts of Babylon and Persia; visions of coming kingdoms.');
  X('proph', 'Ezekiel', [-593, -571], undefined, ['Ezekiel', 1, 1], 'A priest-prophet among the exiles in Babylon.');
  X('proph', 'Haggai', -520, undefined, ['Haggai', 1, 1], 'Urges the returned exiles to finish the temple.');
  X('proph', 'Zechariah', [-520, -480], undefined, ['Zechariah', 1, 1], 'Visions that encourage the rebuilding community.');
  X('proph', 'Malachi', -430, undefined, ['Malachi', 1, 1], 'The last Old Testament prophet; calls for renewed faithfulness.');

  // ── World powers ──────────────────────────────────────────────────────────
  X('world', 'Assyrian Empire', [-745, -612], undefined, null, 'Dominant power from Tiglath-pileser III until the fall of Nineveh.');
  X('world', 'Nineveh falls', -612, undefined, ['Nahum', 3, 7], 'Babylonians and Medes destroy the Assyrian capital.');
  X('world', 'Babylonian Empire', [-626, -539], undefined, null, 'Nebuchadnezzar\'s empire, which took Judah into exile.');
  X('world', 'Babylon falls to Persia', -539, undefined, ['Daniel', 5, 30], 'Cyrus\'s forces take Babylon.');
  X('world', 'Persian Empire', [-539, -331], undefined, null, 'Rules the Jews through the return, Ezra, Nehemiah and Esther.');
  X('world', 'Alexander the Great', [-336, -323], undefined, null, 'Conquers the Persian Empire; Greek culture spreads across the East.');
  X('world', 'Greek kingdoms', [-323, -63], undefined, null, 'Successor kingdoms rule Judea, including the Ptolemies and Seleucids.');
  X('world', 'Maccabean revolt', -167, undefined, null, 'Jews rebel against Seleucid persecution and re-dedicate the temple.');
  X('world', 'Rome rules Judea', [-63, 100], undefined, null, 'Pompey takes Jerusalem in 63 BC; Rome rules through the New Testament era.');
  X('world', 'Herod the Great', [-37, -4], undefined, ['Matthew', 2, 1], 'King of Judea under Rome; rebuilds the temple.');

  // ── New Testament ─────────────────────────────────────────────────────────
  X('nt', 'Jesus born', -5, -4, ['Luke', 2, 7], 'Born in Bethlehem; Adams notes it is now held to be 4 to 6 BC.');
  X('nt', 'Baptism of Jesus', 27, 30, ['Matthew', 3, 16], 'John baptizes Jesus in the Jordan and his ministry begins.');
  X('nt', 'Ministry of Jesus', [27, 30], [30, 33], ['Matthew', 4, 17], 'Teaching, miracles and the call of the twelve.');
  X('nt', 'Crucifixion', 30, 33, ['Luke', 23, 33], 'Jesus is crucified at Jerusalem. Some scholars date it to AD 33.');
  X('nt', 'Resurrection', 30, 33, ['Matthew', 28, 6], 'The tomb is found empty on the third day.');
  X('nt', 'Pentecost', 30, 33, ['Acts', 2, 1], 'The Holy Spirit comes on the disciples and the church begins.');
  X('nt', 'Paul converted', 34, undefined, ['Acts', 9, 3], 'Saul meets the risen Lord on the road to Damascus.');
  X('nt', 'Council of Jerusalem', 49, undefined, ['Acts', 15, 6], 'The church decides Gentiles need not keep the law of Moses.');
  X('nt', 'Paul: 1st journey', [46, 48], undefined, ['Acts', 13, 2], 'Barnabas and Paul take the gospel to Cyprus and Galatia.');
  X('nt', 'Paul: 2nd journey', [49, 52], undefined, ['Acts', 15, 40], 'Through Asia Minor to Macedonia, Athens and Corinth.');
  X('nt', 'Paul: 3rd journey', [53, 57], undefined, ['Acts', 18, 23], 'Centred on Ephesus, then Macedonia and Greece.');
  X('nt', 'Paul in Rome', [60, 62], undefined, ['Acts', 28, 30], 'Two years under house arrest, preaching openly.');
  X('nt', 'Jerusalem destroyed', 70, undefined, ['Luke', 21, 20], 'Roman armies destroy the city and the temple.');
  X('nt', 'Revelation written', 95, undefined, ['Revelation', 1, 9], 'John receives the visions on Patmos.');

  // ── 66 books: [num, name, group, cover [from,to] or null, written [from,to] or null]
  // cover = period the book covers (or the author's ministry); written = traditional composition date.
  const B = [
    [1,  'Genesis',        'Law',            [-4004, -1805], [-1446, -1406]],
    [2,  'Exodus',         'Law',            [-1526, -1445], [-1446, -1406]],
    [3,  'Leviticus',      'Law',            [-1445, -1445], [-1446, -1406]],
    [4,  'Numbers',        'Law',            [-1445, -1406], [-1446, -1406]],
    [5,  'Deuteronomy',    'Law',            [-1406, -1406], [-1446, -1406]],
    [6,  'Joshua',         'History',        [-1406, -1380], [-1390, -1350]],
    [7,  'Judges',         'History',        [-1380, -1050], [-1050, -1000]],
    [8,  'Ruth',           'History',        [-1100, -1050], [-1000, -950]],
    [9,  '1 Samuel',       'History',        [-1105, -1010], [-930, -722]],
    [10, '2 Samuel',       'History',        [-1010, -970],  [-930, -722]],
    [11, '1 Kings',        'History',        [-970, -853],   [-560, -540]],
    [12, '2 Kings',        'History',        [-853, -560],   [-560, -540]],
    [13, '1 Chronicles',   'History',        [-1010, -970],  [-450, -430]],
    [14, '2 Chronicles',   'History',        [-970, -538],   [-450, -430]],
    [15, 'Ezra',           'History',        [-538, -457],   [-457, -440]],
    [16, 'Nehemiah',       'History',        [-445, -425],   [-445, -425]],
    [17, 'Esther',         'History',        [-483, -473],   [-465, -435]],
    [18, 'Job',            'Poetry & Wisdom', null,           null],
    [19, 'Psalms',         'Poetry & Wisdom', [-1010, -430],  [-1010, -430]],
    [20, 'Proverbs',       'Poetry & Wisdom', [-970, -700],   [-970, -700]],
    [21, 'Ecclesiastes',   'Poetry & Wisdom', [-935, -935],   [-935, -935]],
    [22, 'Song of Solomon','Poetry & Wisdom', [-965, -965],   [-965, -965]],
    [23, 'Isaiah',         'Major Prophets', [-740, -681],   [-740, -680]],
    [24, 'Jeremiah',       'Major Prophets', [-627, -580],   [-627, -580]],
    [25, 'Lamentations',   'Major Prophets', [-586, -580],   [-586, -580]],
    [26, 'Ezekiel',        'Major Prophets', [-593, -571],   [-593, -571]],
    [27, 'Daniel',         'Major Prophets', [-605, -536],   [-605, -530]],
    [28, 'Hosea',          'Minor Prophets', [-755, -715],   [-755, -715]],
    [29, 'Joel',           'Minor Prophets', null,           null],
    [30, 'Amos',           'Minor Prophets', [-760, -750],   [-760, -750]],
    [31, 'Obadiah',        'Minor Prophets', null,           null],
    [32, 'Jonah',          'Minor Prophets', [-780, -760],   [-780, -760]],
    [33, 'Micah',          'Minor Prophets', [-735, -700],   [-735, -700]],
    [34, 'Nahum',          'Minor Prophets', [-663, -612],   [-663, -612]],
    [35, 'Habakkuk',       'Minor Prophets', [-609, -598],   [-609, -598]],
    [36, 'Zephaniah',      'Minor Prophets', [-635, -625],   [-635, -625]],
    [37, 'Haggai',         'Minor Prophets', [-520, -520],   [-520, -520]],
    [38, 'Zechariah',      'Minor Prophets', [-520, -480],   [-520, -480]],
    [39, 'Malachi',        'Minor Prophets', [-435, -425],   [-435, -425]],
    [40, 'Matthew',        'Gospels',        [-5, 30],       [55, 65]],
    [41, 'Mark',           'Gospels',        [27, 30],       [55, 60]],
    [42, 'Luke',           'Gospels',        [-5, 30],       [59, 63]],
    [43, 'John',           'Gospels',        [27, 30],       [85, 95]],
    [44, 'Acts',           'Acts',           [30, 62],       [62, 64]],
    [45, 'Romans',         'Paul\'s Letters', [57, 57],      [57, 57]],
    [46, '1 Corinthians',  'Paul\'s Letters', [55, 55],      [55, 55]],
    [47, '2 Corinthians',  'Paul\'s Letters', [56, 56],      [56, 56]],
    [48, 'Galatians',      'Paul\'s Letters', [50, 50],      [50, 50]],
    [49, 'Ephesians',      'Paul\'s Letters', [60, 62],      [60, 62]],
    [50, 'Philippians',    'Paul\'s Letters', [61, 62],      [61, 62]],
    [51, 'Colossians',     'Paul\'s Letters', [60, 62],      [60, 62]],
    [52, '1 Thessalonians','Paul\'s Letters', [51, 51],      [51, 51]],
    [53, '2 Thessalonians','Paul\'s Letters', [51, 52],      [51, 52]],
    [54, '1 Timothy',      'Paul\'s Letters', [62, 64],      [62, 64]],
    [55, '2 Timothy',      'Paul\'s Letters', [66, 67],      [66, 67]],
    [56, 'Titus',          'Paul\'s Letters', [62, 64],      [62, 64]],
    [57, 'Philemon',       'Paul\'s Letters', [60, 62],      [60, 62]],
    [58, 'Hebrews',        'General Letters', [64, 68],      [64, 68]],
    [59, 'James',          'General Letters', [45, 50],      [45, 50]],
    [60, '1 Peter',        'General Letters', [62, 64],      [62, 64]],
    [61, '2 Peter',        'General Letters', [64, 68],      [64, 68]],
    [62, '1 John',         'General Letters', [85, 95],      [85, 95]],
    [63, '2 John',         'General Letters', [85, 95],      [85, 95]],
    [64, '3 John',         'General Letters', [85, 95],      [85, 95]],
    [65, 'Jude',           'General Letters', [65, 68],      [65, 68]],
    [66, 'Revelation',     'Prophecy',       [94, 96],       [94, 96]],
  ];

  const BOOK_NOTES = {
    'Job': 'Undated; set in the patriarchal age by most readers.',
    'Joel': 'Date is debated, so no bar is drawn.',
    'Obadiah': 'Date is debated (about 845 or 586 BC), so no bar is drawn.'
  };

  window.TL_LANES = LANES;
  window.TL_EVENTS = EV;
  window.TL_BOOKS = B.map(b => ({ n: b[0], name: b[1], group: b[2], cover: b[3], written: b[4], note: BOOK_NOTES[b[1]] || '' }));
})();
