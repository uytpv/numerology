import * as fs from 'fs';
import * as path from 'path';

// Từ điển các âm tiết / từ vựng tiếng Việt phổ biến để tách từ dính chữ
const VN_SYLLABLES = new Set([
  'và', 'các', 'của', 'được', 'người', 'những', 'một', 'cho', 'với', 'khi', 'để', 'lớn', 'rất',
  'năng', 'lượng', 'phát', 'triển', 'thành', 'công', 'chuyên', 'nghiệp', 'ngoại', 'cảm', 'tâm',
  'hồn', 'cuộc', 'sống', 'tương', 'lai', 'rõ', 'ràng', 'hơn', 'thực', 'tế', 'thách', 'thức',
  'cân', 'bằng', 'trưởng', 'thành', 'linh', 'hồn', 'nhân', 'cách', 'đường', 'đời', 'sứ', 'mệnh',
  'ngày', 'sinh', 'tháng', 'năm', 'thế', 'hệ', 'chặng', 'đỉnh', 'cao', 'bài', 'học', 'nợ', 'nghiệp',
  'thiếu', 'đam', 'mê', 'tư', 'duy', 'lý', 'trí', 'thái', 'độ', 'tiềm', 'thức', 'sức', 'mạnh',
  'kết', 'nối', 'liên', 'giải', 'pháp', 'hành', 'động', 'cơ', 'hội', 'rủi', 'ro', 'bản', 'thân',
  'lãnh', 'đạo', 'sáng', 'tạo', 'nghiên', 'cứu', 'chuyên', 'gia', 'chia', 'sẻ', 'quan', 'điểm',
  'khai', 'sáng', 'hỗn', 'loạn', 'gấp', 'đôi', 'tính', 'cách', 'ấn', 'tượng', 'truyền', 'động',
  'lực', 'khoa', 'học', 'công', 'nghệ', 'điện', 'tử', 'sáng', 'chế', 'khởi', 'xướng', 'dự', 'án',
  'lĩnh', 'vực', 'sửa', 'chữa', 'biết', 'ơn', 'tích', 'cực', 'trường', 'hợp', 'hấp', 'dẫn', 'hào',
  'hứng', 'ý', 'tưởng', 'trân', 'trọng', 'lắng', 'nghe', 'hướng', 'đi', 'đúng', 'đắn', 'nhìn',
  'thấy', 'khó', 'đoán', 'im', 'lặng', 'hoài', 'bão', 'mong', 'muốn', 'vượt', 'quá', 'khả',
  'năng', 'tử', 'tế', 'đừng', 'làm', 'dành', 'toàn', 'tâm', 'phương', 'châm', 'quen', 'tốt',
  'bình', 'tĩnh', 'mất', 'cởi', 'mở', 'đón', 'nhận', 'suy', 'nghĩ', 'xung', 'quanh', 'quyết',
  'định', 'trái', 'tim', 'óc', 'ưu', 'điểm', 'nhược', 'linh', 'hoạt', 'thích', 'quan', 'giúp',
  'đỡ', 'mọi', 'nhạy', 'sứ', 'giả', 'phán', 'xử', 'trung', 'gian', 'công', 'minh', 'khiêm',
  'tốn', 'thẳng', 'thắn', 'kỹ', 'ngoại', 'giao', 'tùy', 'vào', 'thiên', 'hướng', 'từng', 'cá',
  'lo', 'âu', 'thế', 'yếu', 'đoán', 'bắt', 'đầu', 'việc', 'gì', 'đó', 'mục', 'đích', 'kì', 'diệu',
  'bên', 'trong', 'mỗi', 'niềm', 'tin', 'sâu', 'sắc', 'vững', 'vàng', 'lung', 'lay', 'đạo', 'đức',
  'nghĩ', 'hay', 'nói', 'về', 'bạn', 'biểu', 'tượng', 'nguyên', 'tắc', 'mức', 'rung', 'động', 'cao',
  'hơn', 'đại', 'diện', 'bao', 'gồm', 'hai', 'do', 'đó', 'tổng', 'chữ', 'số', 'ngược', 'lại',
  'hoàn', 'toàn', 'điều', 'vì', 'vậy', 'đôi', 'gây', 'mạnh', 'nhà', 'phát', 'minh', 'giáo', 'viên',
  'giảng', 'viết', 'sách', 'hoạt', 'chính', 'trị', 'triết', 'thiên', 'văn', 'cải', 'nghệ', 'sĩ',
  'trừu', 'tượng', 'nhạc', 'đặc', 'điểm', 'chủ', 'tiềm', 'thúc', 'đẩy', 'môn', 'hiệu', 'ứng', 'áp',
  'dụng', 'tâm', 'lý', 'cố', 'gắng', 'luôn', 'hầu', 'hết', 'nên', 'họ', 'khác', 'tìm', 'được'
]);

// Danh sách cụ thể các từ dính chữ thường gặp trong văn bản OCR của MFS
const KNOWN_GLUED_REPLACEMENTS: [RegExp, string][] = [
  [/Sốchủ(\d+)/gi, 'Số chủ $1'],
  [/Số(\d+)làbiểutượng/gi, 'Số $1 là biểu tượng'],
  [/làbiểutượng/gi, 'là biểu tượng'],
  [/chonguyêntắc/gi, 'cho nguyên tắc'],
  [/caohơn/gi, 'cao hơn'],
  [/dođógấpđôi/gi, 'do đó gấp đôi'],
  [/tínhcáchcủa“số(\d+)”/gi, 'tính cách của “số $1”'],
  [/tínhcáchcủa/gi, 'tính cách của'],
  [/tượngmạnh/gi, 'tượng mạnh'],
  [/cótiềmnăng/gi, 'có tiềm năng'],
  [/rấtlớn/gi, 'rất lớn'],
  [/đểtrởthànhnguồnnănglượng/gi, 'để trở thành nguồn năng lượng'],
  [/đểtrởthành/gi, 'để trở thành'],
  [/nguồnnănglượng/gi, 'nguồn năng lượng'],
  [/độnglực/gi, 'động lực'],
  [/chongườikhác/gi, 'cho người khác'],
  [/nhásángchế/gi, 'nhà sáng chế'],
  [/trongcáclĩnh/gi, 'trong các lĩnh'],
  [/vựckhoahọccôngnghệ/gi, 'vực khoa học công nghệ'],
  [/khoahọccôngnghệ/gi, 'khoa học công nghệ'],
  [/điệntửvàngoạicảm/gi, 'điện tử và ngoại cảm'],
  [/vàngoạicảm/gi, 'và ngoại cảm'],
  [/đắntrongcuộcsốngvà/gi, 'đắn trong cuộc sống và'],
  [/trongcuộcsống/gi, 'trong cuộc sống'],
  [/nhìn thấyđược/gi, 'nhìn thấy được'],
  [/tươnglai/gi, 'tương lai'],
  [/mộtcáchrõrànghơn/gi, 'một cách rõ ràng hơn'],
  [/rõrànghơn/gi, 'rõ ràng hơn'],
  [/thìhọlàm/gi, 'thì họ làm'],
  [/điềuđó/gi, 'điều đó'],
  [/đềucó/gi, 'đều có'],
  [/điềugìđótốtđểnói/gi, 'điều gì đó tốt để nói'],
  [/tốtđểnói/gi, 'tốt để nói'],
  [/vềbạn/gi, 'về bạn'],
  [/mấtcânbằng/gi, 'mất cân bằng'],
  [/nênnằmở/gi, 'nên nằm ở'],
  [/tráitimvàtríóccủabạn/gi, 'trái tim và trí óc của bạn'],
  [/tríóccủabạn/gi, 'trí óc của bạn'],
  [/Ưuđiểm/gi, 'Ưu điểm'],
  [/Nhượcđiểm/gi, 'Nhược điểm'],
  [/thẳngthắnvà/gi, 'thẳng thắn và'],
  [/cókỹnăngngoạigiaotốt/gi, 'có kỹ năng ngoại giao tốt'],
  [/kỹnăngngoạigiao/gi, 'kỹ năng ngoại giao'],
  [/Tùyvào/gi, 'Tùy vào'],
  [/vàthiênhướng/gi, 'và thiên hướng'],
  [/củatừng/gi, 'của từng'],
  [/cánhân/gi, 'cá nhân'],
  [/màưuđiểm/gi, 'mà ưu điểm'],
  [/củasố(\d+)/gi, 'của số $1'],
  [/nhượcđiểm/gi, 'nhược điểm'],
  [/Thếmạnh/gi, 'Thế mạnh'],
  [/cóthểtrởthành/gi, 'có thể trở thành'],
  [/điểmyếu/gi, 'điểm yếu'],
  [/thuộcsố(\d+)/gi, 'thuộc số $1'],
  [/thiếuquyếtđoán/gi, 'thiếu quyết đoán'],
  [/vàgặpkhókhăn/gi, 'và gặp khó khăn'],
  [/gặpkhókhăn/gi, 'gặp khó khăn'],
  [/trongviệc/gi, 'trong việc'],
  [/bắtđầulàm/gi, 'bắt đầu làm'],
  [/việcgìđó/gi, 'việc gì đó'],
  [/khaisáng/gi, 'khai sáng'],
  [/mạnhmẽ/gi, 'mạnh mẽ'],
  [/chia sẻnhữngquanđiểm/gi, 'chia sẻ những quan điểm'],
  [/nhữngquanđiểm/gi, 'những quan điểm'],
  [/nhữnggìmọi/gi, 'những gì mọi'],
  [/nghĩhaynói/gi, 'nghĩ hay nói'],
  [/củaconsố/gi, 'của con số'],
  [/cân bằng9/gi, 'cân bằng 9'],
  [/Tháiđộcủabạn/gi, 'Thái độ của bạn'],
  [/khiđốidiệnvớivấnđề/gi, 'khi đối diện với vấn đề'],
  [/nghịchcảnh/gi, 'nghịch cảnh'],
  [/Bứctranhtoàncảnh/gi, 'Bức tranh toàn cảnh'],
  [/vềnhữngđặcđiểmcóthểgiúp/gi, 'về những đặc điểm có thể giúp'],
  [/bạnthànhcônghoặckhiếnbạnthấtbại/gi, 'bạn thành công hoặc khiến bạn thất bại'],
  [/thànhcônghoặc/gi, 'thành công hoặc'],
  [/khiếnbạnthấtbại/gi, 'khiến bạn thất bại'],
  [/Labàndẫn/gi, 'La bàn dẫn'],
  [/lốigiúpbạnhoànthànhsứmệnhcuộcđờigiaophó/gi, 'lối giúp bạn hoàn thành sứ mệnh cuộc đời giao phó'],
  [/hoànthànhsứmệnh/gi, 'hoàn thành sứ mệnh'],
  [/cuộcđờigiaophó/gi, 'cuộc đời giao phó'],
  [/Cầunốigiữa/gi, 'Cầu nối giữa'],
  [/bạnmong/gi, 'bạn mong'],
  [/ướctrởthành/gi, 'ước trở thành'],
  [/thựcsựcủabạn/gi, 'thực sự của bạn'],
  [/Khaokhátẩngiấu/gi, 'Khao khát ẩn giấu'],
  [/trongtâmhồn/gi, 'trong tâm hồn'],
  [/lýdophíasau/gi, 'lý do phía sau'],
  [/mọihànhđộngcủabạn/gi, 'mọi hành động của bạn'],
  [/lĩnhvựcchuyênmôn/gi, 'lĩnh vực chuyên môn'],
  [/hoặckỹnăng/gi, 'hoặc kỹ năng'],
  [/màbạncầnpháttriển/gi, 'mà bạn cần phát triển'],
  [/vàsẽthànhcông/gi, 'và sẽ thành công'],
  [/nếugắnbócảđờivớichúng/gi, 'nếu gắn bó cả đời với chúng'],
  [/gắnbócảđời/gi, 'gắn bó cả đời'],
  [/vớichúng/gi, 'với chúng'],
  [/Cátính/gi, 'Cá tính'],
  [/thếgiớiquan/gi, 'thế giới quan'],
  [/cácmốiquanhệ/gi, 'các mối quan hệ'],
  [/vàcácvấnđề/gi, 'và các vấn đề'],
  [/trongcáchbạnđốinhânxửthế/gi, 'trong cách bạn đối nhân xử thế'],
  [/đốinhânxửthế/gi, 'đối nhân xử thế'],
  [/giátrị/gi, 'giá trị'],
  [/khátvọng/gi, 'khát vọng'],
  [/mụctiêucủabạn/gi, 'mục tiêu của bạn'],
  [/trongthờikỳ/gi, 'trong thời kỳ'],
  [/Điểmyếubạncầnkhắcphục/gi, 'Điểm yếu bạn cần khắc phục'],
  [/cầnkhắcphục/gi, 'cần khắc phục'],
  [/CHỈ SỐ SỨC MẠNH TIỀM THỨC/gi, 'Chỉ số Sức mạnh tiềm thức'],
  [/CHỈ SỐ TƯ DUY LÝ TRÍ/gi, 'Chỉ số Tư duy lý trí'],
  [/CHỈ SỐ ĐAM MÊ/gi, 'Chỉ số Đam mê'],
  [/Đặcđiểmtínhcách/gi, 'Đặc điểm tính cách'],
  [/màbạncầnpháttriểnđể/gi, 'mà bạn cần phát triển để'],
  [/ứngphóvàgiảiquyếtvấnđề/gi, 'ứng phó và giải quyết vấn đề'],
  [/giảiquyếtvấnđề/gi, 'giải quyết vấn đề'],
  [/Kỹnăngđặcbiệt/gi, 'Kỹ năng đặc biệt'],
  [/sởthích/gi, 'sở thích'],
  [/đammê/gi, 'đam mê'],
  [/nhữnghoạtđộng/gi, 'những hoạt động'],
  [/mangđếnsựtựnhậnthức/gi, 'mang đến sự tự nhận thức'],
  [/vàniềmvuichobạn/gi, 'và niềm vui cho bạn'],
  [/niềmvuicho/gi, 'niềm vui cho'],
  [/CHỈ SỐ NĂM/gi, 'Chỉ số Năm cá nhân'],
  [/CHỈ SỐ THÁNG/gi, 'Chỉ số Tháng cá nhân'],
  [/CHỈ SỐ CHẶNG/gi, 'Chỉ số Chặng Kim Tự Tháp'],
  [/CHỈ SỐ THÁCH THỨC/gi, 'Chỉ số Thách thức'],
  [/Nhữngthayđổisẽxảyra/gi, 'Những thay đổi sẽ xảy ra'],
  [/trongnhữngnămtới/gi, 'trong những năm tới'],
  [/trongnhữngthángtới/gi, 'trong những tháng tới'],
  [/vàcáchbạnnênứngxử/gi, 'và cách bạn nên ứng xử'],
  [/nênứngxử/gi, 'nên ứng xử'],
  [/Mứcđộtrưởngthành/gi, 'Mức độ trưởng thành'],
  [/tráchnhiệm/gi, 'trách nhiệm'],
  [/khảnănglĩnhhội/gi, 'khả năng lĩnh hội'],
  [/lĩnhhội/gi, 'lĩnh hội'],
  [/cácsựkiệnquantrọng/gi, 'các sự kiện quan trọng'],
  [/trongmỗichặngđườngđời/gi, 'trong mỗi chặng đường đời'],
  [/chặngđườngđời/gi, 'chặng đường đời'],
  [/Vấnđềlớnbạnsẽđốimặt/gi, 'Vấn đề lớn bạn sẽ đối mặt'],
  [/vàbạnnênlàmgìđể/gi, 'và bạn nên làm gì để'],
  [/vượtquanó/gi, 'vượt qua nó'],
  [/vượtqua/gi, 'vượt qua']
];

export function cleanAndFormatText(raw: string): string {
  if (!raw) return '';

  // 0. Bắt buộc chuẩn hóa Unicode sang dạng dựng sẵn (NFC)
  let text = raw.normalize('NFC');

  // 1. Cắt bỏ các đoạn rác OCR dính trang từ PDF gốc (như - Sứ mệnh - 1, - Nhân cách - 0, Họ tên: Lê Thị Nhật Ly...)
  text = text
    .replace(/- Sứ mệnh - \d[\s\S]*?(?=###|$)/gi, '')
    .replace(/- Nhân cách - \d[\s\S]*?(?=###|$)/gi, '')
    .replace(/- Linh hồn - \d[\s\S]*?(?=###|$)/gi, '')
    .replace(/- Cầu nối - \d[\s\S]*?(?=###|$)/gi, '')
    .replace(/Họ tên:.*?(Ngày sinh:|\n|$)/gi, '')
    .replace(/https:\/\/gein\.vn\s*\|\s*Hotline:\s*[\d\.]+\s*\d*/gi, '')
    .replace(/Họ tên:.*Ngày sinh:.*\d{2}\/\d{2}\/\d{4}/gi, '')
    .replace(/NĂNG LƯỢNG CỦA CÁC CON SỐ/gi, '')
    .replace(/Bản đồ thành công – Map for Success/gi, 'Bản đồ Life Maps')
    .replace(/Map for Success/gi, 'Life Maps')
    .replace(/GEIN/gi, 'Life Maps')
    .replace(/\b\d{2}\.\s*Chỉ số\s+[^\n\r-]+[-–]\s*[\d,]+/gi, '')
    .replace(/\b\d{2}\.\s*Chỉ số\s+[^\n\r-]+/gi, '');

  // 2. Chuẩn hóa các đoạn suy diễn sai lệch trong chỉ số thiếu số 6
  text = text
    .replace(/Nếu thiếu số 6, bạn có thể trải qua một thời thơ ấu thiếu tình yêu thương[\s\S]*?yêu thương người khác\./gi, 
      'Số 6 không xuất hiện trong chuỗi chữ cái của họ tên khai sinh. Điều này phản ánh chủ đề cần rèn luyện có chủ đích về khả năng chăm sóc, lắng nghe và dung hòa trách nhiệm; không phải là cơ sở để kết luận về quá khứ, tuổi thơ hay mức độ được yêu thương.')
    .replace(/Đôi khi xuất phát từ trải nghiệm thiếu thốn tình cảm trong quá khứ khiến bạn không biết cách thể hiện tình cảm/gi, 
      'Việc chưa có thói quen thể hiện sự quan tâm chăm sóc có thể khiến bạn đôi lúc lúng túng trong các mối quan hệ thân thiết');

  // 3. Chuẩn hóa các cụm từ định mệnh / phóng đại sang văn phong khai vấn Life Coaching
  text = text
    .replace(/bản hợp đồng tâm thức/gi, 'định hướng phát triển nội tại')
    .replace(/Hãy hành động bất chấp, hãy làm điên cuồng/gi, 'Hãy kiên trì và chủ động hành động')
    .replace(/hãy làm điên cuồng/gi, 'hãy kiên trì thực thi')
    .replace(/Họ cần bạn, khát khao những giá trị nhân văn đến từ bạn/gi, 'Môi trường sống luôn đón nhận những giá trị nhân văn và sự đóng góp từ bạn')
    .replace(/Bạn có đủ mọi điều kiện/gi, 'Bạn sở hữu những tiềm năng nền tảng thuận lợi')
    .replace(/Bạn rất thích quyền lực/gi, 'Bạn có xu hướng chủ động nắm giữ quyền điều phối và ra quyết định')
    .replace(/Bạn sẽ trở thành chuyên gia thực thụ với năng lực không ai lay chuyển/gi, 'Bạn có tiềm năng phát triển thành chuyên gia vững vàng với kiến thức sâu rộng')
    .replace(/Bạn sẽ được đón nhận những điều vô cùng tuyệt vời không phải là vật chất/gi, 'Bạn sẽ nuôi dưỡng được những giá trị tinh thần tích cực và bền vững')
    .replace(/sự nghiệp mà bạn bắt buộc phải trải nghiệm/gi, 'lĩnh vực mà bạn có nhiều cơ hội rèn luyện và phát triển')
    .replace(/bắt buộc phải/gi, 'nên ưu tiên')
    .replace(/chắc chắn sẽ/gi, 'có nhiều khả năng sẽ')
    .replace(/vũ trụ sẽ/gi, 'tiến trình rèn luyện sẽ');

  // 4. Áp dụng bảng sửa dính chữ đặc thù
  for (const [regex, rep] of KNOWN_GLUED_REPLACEMENTS) {
    text = text.replace(regex, rep);
  }

  // 5. Tách dính chữ giữa số và chữ (vd: "số11có" -> "số 11 có")
  text = text.replace(/(\d+)([a-zA-Zà-ỹÀ-Ỹ])/g, '$1 $2');
  text = text.replace(/([a-zA-Zà-ỹÀ-Ỹ])(\d+)/g, '$1 $2');

  // 6. Chuẩn hóa xuống dòng và nối câu bị gãy nhịp
  text = text.replace(/\r/g, '');

  const rawLines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const formattedParagraphs: string[] = [];
  let currentBuffer: string[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];

    // Phát hiện tiêu đề phân đoạn
    if (/^(Ưu điểm|Nhược điểm|Sự nghiệp|Đặc điểm|Lời khuyên|Khuyến nghị|Năng lượng cốt lõi|Thách thức|Người truyền động lực|Hãy làm tử tế, không thì đừng làm!)/i.test(line)) {
      if (currentBuffer.length > 0) {
        formattedParagraphs.push(currentBuffer.join(' '));
        currentBuffer = [];
      }
      formattedParagraphs.push(`### ${line}`);
      continue;
    }

    // Nếu dòng kết thúc bằng dấu câu hoàn chỉnh (. : ! ? …)
    if (/[.:!?…]$/.test(line)) {
      currentBuffer.push(line);
      if (currentBuffer.length >= 2 || line.length > 90) {
        formattedParagraphs.push(currentBuffer.join(' '));
        currentBuffer = [];
      }
    } else {
      currentBuffer.push(line);
    }
  }

  if (currentBuffer.length > 0) {
    formattedParagraphs.push(currentBuffer.join(' '));
  }

  let result = formattedParagraphs.join('\n\n');

  // Dọn dẹp khoảng trắng dư thừa
  result = result
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s+\n/g, '\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return result;
}
