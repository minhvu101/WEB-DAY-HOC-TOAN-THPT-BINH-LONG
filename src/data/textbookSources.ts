export interface TextbookSourceItem {
  id: string;
  grade: number;
  curriculum: 'KNTT' | 'CTST' | 'Cánh Diều';
  chapter: string;
  lessonTitle: string;
  sourceType: string;
  contentSnippet: string;
  keyFormulas: string[];
  realLifeApplication: string;
  suggestedObjectives: {
    knowledge: string[];
    generalCompetencies: string[];
    specificCompetencies: string[];
    qualities: string[];
  };
  sampleActivities: {
    step: string;
    title: string;
    duration: string;
    description: string;
  }[];
}

export const DIGITAL_TEXTBOOK_SOURCES: TextbookSourceItem[] = [
  {
    id: 'SRC-KNTT-11-CSN',
    grade: 11,
    curriculum: 'KNTT',
    chapter: 'Chương 2: Dãy số. Cấp số cộng và cấp số nhân',
    lessonTitle: 'Bài 3: Cấp số cộng và cấp số nhân',
    sourceType: 'SGK Toán 11 Tập 1 - Kết nối tri thức (Trang 48-56)',
    contentSnippet: `NỘI DUNG TÀI LIỆU GỐC (SGK TOÁN 11 KNTT - BÀI 3):
1. Khởi động: Bác An gửi tiết kiệm 100 triệu đồng vào ngân hàng với lãi suất 6%/năm theo hình thức lãi kép. Hãy tính số tiền bác An nhận được sau 1 năm, 2 năm, 3 năm và nhận xét quy luật.
2. Khái niệm Cấp số cộng: Dãy số (u_n) là cấp số cộng nếu u_{n} = u_{n-1} + d với mọi n >= 2 (d là công sai). Số hạng tổng quát: u_n = u_1 + (n - 1)d. Tổng n số hạng đầu: S_n = n(u_1 + u_n)/2 = n[2u_1 + (n-1)d]/2.
3. Khái niệm Cấp số nhân: Dãy số (u_n) là cấp số nhân nếu u_n = u_{n-1} * q với mọi n >= 2 (q là công bội). Số hạng tổng quát: u_n = u_1 * q^{n-1}. Tổng n số hạng đầu: S_n = u_1(1 - q^n)/(1 - q) với q != 1.
4. Hoạt động luyện tập SGK: Bài toán xếp hàng ghế nhà hát (hàng đầu 15 ghế, mỗi hàng sau thêm 2 ghế), bài toán phân rã hạt nhân, và bài toán vay trả góp ngân hàng.`,
    keyFormulas: [
      'u_n = u_1 + (n - 1)d',
      'S_n = \\frac{n(u_1 + u_n)}{2} = \\frac{n[2u_1 + (n - 1)d]}{2}',
      'u_n = u_1 \\cdot q^{n - 1}',
      'S_n = \\frac{u_1(1 - q^n)}{1 - q} \\quad (q \\ne 1)',
    ],
    realLifeApplication: 'Bài toán tài chính: Tiết kiệm lãi kép, tính tiền mua trả góp điện thoại, và bài toán sắp xếp chỗ ngồi khán đài sân vận động.',
    suggestedObjectives: {
      knowledge: [
        'Nhận biết và phân biệt được khái niệm cấp số cộng (công sai d) và cấp số nhân (công bội q).',
        'Thiết lập và vận dụng thành thạo công thức số hạng tổng quát và tổng n số hạng đầu tiên.',
        'Giải quyết các bài toán thực tiễn về tính lãi suất tiền gửi ngân hàng và quy hoạch chỗ ngồi.',
      ],
      generalCompetencies: [
        'Năng lực tự chủ và tự học: Tự giác phát hiện quy luật số học từ bảng số liệu.',
        'Năng lực giải quyết vấn đề và sáng tạo: Lập mô hình chuỗi thời gian cho bài toán tài chính gia đình.',
      ],
      specificCompetencies: [
        'Năng lực mô hình hóa toán học: Chuyển đổi bài toán gửi tiết kiệm thành công thức tổng cấp số nhân.',
        'Năng lực tư duy và lập luận toán học: Chứng minh công thức số hạng tổng quát bằng phương pháp quy nạp.',
      ],
      qualities: [
        'Chăm chỉ, cẩn thận, có trách nhiệm trong tính toán tài chính cá nhân.',
      ],
    },
    sampleActivities: [
      {
        step: 'Hoạt động 1',
        title: 'Khởi động: Bài toán gửi tiết kiệm tích lũy',
        duration: '7 phút',
        description: 'Giáo viên nêu tình huống gửi tiết kiệm 100 triệu đồng với lãi suất 6%/năm. Học sinh lập bảng số liệu 3 năm đầu và phát hiện tỉ số không đổi.',
      },
      {
        step: 'Hoạt động 2',
        title: 'Hình thành kiến thức: Công thức CSC & CSN',
        duration: '23 phút',
        description: 'Học sinh làm việc nhóm 4 tổ: Xây dựng định nghĩa, công thức số hạng tổng quát $u_n = u_1 + (n-1)d$ và $u_n = u_1 \\cdot q^{n-1}$. Thảo luận công thức tính tổng $S_n$.',
      },
      {
        step: 'Hoạt động 3',
        title: 'Luyện tập: Giải bài toán xếp ghế khán đài',
        duration: '10 phút',
        description: 'Học sinh áp dụng công thức $S_n$ để tính tổng số ghế trong rạp hát có 25 hàng ghế. Làm bài trắc nghiệm nhanh trên MathHub.',
      },
      {
        step: 'Hoạt động 4',
        title: 'Vận dụng: Bài toán mua điện thoại trả góp',
        duration: '5 phút',
        description: 'Mô phỏng bài toán vay tiêu dùng và kế hoạch trả nợ hàng tháng. Giao nhiệm vụ tìm thêm ví dụ thực tế trong đời sống.',
      },
    ],
  },
  {
    id: 'SRC-CTST-11-DAOHAM',
    grade: 11,
    curriculum: 'CTST',
    chapter: 'Chương 7: Đạo hàm',
    lessonTitle: 'Bài 1: Định nghĩa và ý nghĩa của đạo hàm',
    sourceType: 'SGK Toán 11 Tập 2 - Chân trời sáng tạo (Trang 28-36)',
    contentSnippet: `NỘI DUNG TÀI LIỆU GỐC (SGK TOÁN 11 CTST - BÀI 1 ĐẠO HÀM):
1. Hoạt động khởi động: Một ô tô chuyển động thẳng với phương trình quãng đường s(t) = 5t^2. Vận tốc trung bình trong khoảng thời gian [t_0; t] là v_tb = (s(t) - s(t_0))/(t - t_0). Làm thế nào xác định vận tốc tức thời tại thời điểm t_0?
2. Định nghĩa đạo hàm tại một điểm: Cho hàm số y = f(x) xác định trên (a; b) và x_0 thuộc (a; b). Giới hạn hữu hạn (nếu có) của tỉ số [f(x) - f(x_0)]/(x - x_0) khi x dần đến x_0 được gọi là đạo hàm của hàm số tại x_0, ký hiệu f'(x_0).
3. Ý nghĩa hình học: f'(x_0) là hệ số góc của tiếp tuyến của đồ thị hàm số y = f(x) tại điểm M_0(x_0; f(x_0)). Phương trình tiếp tuyến: y - y_0 = f'(x_0)(x - x_0).
4. Ý nghĩa vật lý: Vận tốc tức thời v(t_0) = s'(t_0); gia tốc tức thời a(t_0) = v'(t_0).
5. Hoạt động trải nghiệm: Khảo sát cát tuyến MA tiến dần tới tiếp tuyến khi A di chuyển dọc trên parabol bằng phần mềm trực quan.`,
    keyFormulas: [
      "f'(x_0) = \\lim_{\\Delta x \\to 0} \\frac{f(x_0 + \\Delta x) - f(x_0)}{\\Delta x}",
      "y - y_0 = f'(x_0)(x - x_0)",
      "v(t_0) = s'(t_0)",
    ],
    realLifeApplication: 'Vật lý và Kỹ thuật: Xác định vận tốc xe đua tức thời, gia tốc hãm phanh, và bài toán góc nghiêng mái vòm kiến trúc.',
    suggestedObjectives: {
      knowledge: [
        'Hiểu rõ định nghĩa đạo hàm qua giới hạn của tỉ số số gia.',
        'Nắm vững ý nghĩa hình học của đạo hàm là hệ số góc của tiếp tuyến tại tiếp điểm.',
        'Viết thành thạo phương trình tiếp tuyến của đồ thị hàm số tại một điểm cho trước.',
      ],
      generalCompetencies: [
        'Năng lực tự chủ và tự học: Quan sát mô phỏng cát tuyến chuyển thành tiếp tuyến trên MathHub Math Lab.',
        'Năng lực giao tiếp và hợp tác: Trình bày và phản biện các bước tính đạo hàm bằng định nghĩa.',
      ],
      specificCompetencies: [
        'Năng lực tư duy và lập luận toán học: Phân tích sự chuyển dịch từ vận tốc trung bình sang vận tốc tức thời.',
        'Năng lực sử dụng công cụ học toán: Ứng dụng thanh trượt số gia h trên phần mềm để trực quan hóa giới hạn.',
      ],
      qualities: [
        'Kiên trì, cẩn trọng trong các phép biến đổi đại số và tính toán giới hạn.',
      ],
    },
    sampleActivities: [
      {
        step: 'Hoạt động 1',
        title: 'Khởi động: Đo vận tốc xe đua tại thời điểm t = 2s',
        duration: '7 phút',
        description: 'Xuất phát từ bài toán chuyển động $s(t) = 5t^2$. Tính vận tốc trung bình trên các khoảng $[2; 2.1]$, $[2; 2.01]$, $[2; 2.001]$ và dự đoán tốc độ tức thời.',
      },
      {
        step: 'Hoạt động 2',
        title: 'Hình thành kiến thức: Định nghĩa đạo hàm & Ý nghĩa hình học',
        duration: '23 phút',
        description: 'Dẫn dắt công thức $f\'(x_0) = \\lim_{\\Delta x \\to 0} \\frac{\\Delta y}{\\Delta x}$. Quan sát cát tuyến biến thành tiếp tuyến trên Math Lab. Thiết lập phương trình tiếp tuyến.',
      },
      {
        step: 'Hoạt động 3',
        title: 'Luyện tập: Viết phương trình tiếp tuyến của Parabol',
        duration: '10 phút',
        description: 'Học sinh áp dụng công thức viết tiếp tuyến của Parabol $y = x^2$ tại điểm $A(1; 1)$. Thực hiện giải trắc nghiệm tương tác trên MathHub.',
      },
      {
        step: 'Hoạt động 4',
        title: 'Vận dụng: Tính gia tốc chuyển động tên lửa vũ trụ',
        duration: '5 phút',
        description: 'Giải bài toán vật lý tìm thời điểm tên lửa đạt vận tốc cực đại từ hàm quãng đường. Giao bài tự luyện về nhà.',
      },
    ],
  },
  {
    id: 'SRC-KNTT-10-PARABOL',
    grade: 10,
    curriculum: 'KNTT',
    chapter: 'Chương 3: Hàm số bậc hai và đồ thị',
    lessonTitle: 'Bài 1: Hàm số bậc hai và đồ thị',
    sourceType: 'SGK Toán 10 Tập 1 - Kết nối tri thức (Trang 39-47)',
    contentSnippet: `NỘI DUNG TÀI LIỆU GỐC (SGK TOÁN 10 KNTT - HÀM SỐ BẬC HAI):
1. Hoạt động Khởi động: Quan sát tia nước phun lên từ đài phun nước hoặc quỹ đạo quả bóng rổ khi ném vào rổ. Nhận xét đường cong có đỉnh cao nhất và đối xứng.
2. Định nghĩa: Hàm số bậc hai là hàm số được cho bằng biểu thức dạng y = ax^2 + bx + c (a != 0). Tập xác định D = R.
3. Đồ thị hàm số: Đồ thị là một parabol có đỉnh I(-b/(2a); -Delta/(4a)), có trục đối xứng là đường thẳng x = -b/(2a).
- Bề lõm quay lên trên nếu a > 0. Điểm I là điểm thấp nhất.
- Bề lõm quay xuống dưới nếu a < 0. Điểm I là điểm cao nhất.
4. Bảng biến thiên: Lập bảng biến thiên theo 2 trường hợp hệ số a dương và a âm.
5. Vận dụng: Cổng Parabol trường Đại học Bách Khoa Hà Nội, độ sâu chảo ăng-ten vệ tinh.`,
    keyFormulas: [
      'y = ax^2 + bx + c \\quad (a \\ne 0)',
      'I\\left(-\\frac{b}{2a}; -\\frac{\\Delta}{4a}\\right)',
      'x = -\\frac{b}{2a}',
    ],
    realLifeApplication: 'Thiết kế kiến trúc mái vòm, cầu treo parabol, chảo thu sóng parabol và tối ưu tầm bay của bóng thể thao.',
    suggestedObjectives: {
      knowledge: [
        'Xác định được tọa độ đỉnh, trục đối xứng và hướng bề lõm của parabol $y = ax^2 + bx + c$.',
        'Lập được bảng biến thiên và vẽ thành thạo đồ thị hàm số bậc hai.',
        'Giải quyết các bài toán thực tiễn về giá trị lớn nhất, giá trị nhỏ nhất của hàm số bậc hai.',
      ],
      generalCompetencies: [
        'Năng lực tự chủ và tự học: Sử dụng công cụ tương tác Math Lab kéo thanh trượt hệ số a, b, c.',
        'Năng lực giao tiếp và hợp tác: Làm việc nhóm khảo sát sự biến thiên của hàm số bậc hai.',
      ],
      specificCompetencies: [
        'Năng lực mô hình hóa toán học: Lập phương trình parabol mô tả cây cầu Cổng Vàng.',
        'Năng lực giải quyết vấn đề toán học: Tìm chiều cao tối đa của quả bóng rổ.',
      ],
      qualities: [
        'Chăm chỉ, kiên trì, hào hứng ứng dụng toán học vào các hiện tượng đời sống.',
      ],
    },
    sampleActivities: [
      {
        step: 'Hoạt động 1',
        title: 'Khởi động: Chiêm ngưỡng quỹ đạo ném bóng rổ',
        duration: '6 phút',
        description: 'Chiếu video cú ném 3 điểm bóng rổ. Học sinh quan sát đường cong và nêu nhận xét về điểm cao nhất và tính đối xứng.',
      },
      {
        step: 'Hoạt động 2',
        title: 'Hình thành kiến thức: Tọa độ đỉnh, Trục đối xứng & Bảng biến thiên',
        duration: '24 phút',
        description: 'Giáo viên hướng dẫn hoàn thiện bình phương $y = a(x + b/(2a))^2 - \\Delta/(4a)$. Rút ra tọa độ đỉnh và trục đối xứng. Vẽ bảng biến thiên 2 trường hợp $a>0$ và $a<0$.',
      },
      {
        step: 'Hoạt động 3',
        title: 'Luyện tập: Kéo thả tương tác Parabol trên MathHub Math Lab',
        duration: '10 phút',
        description: 'Học sinh dùng điện thoại/laptop mở MathHub Math Lab, thay đổi các hệ số a, b, c và quan sát trực tiếp sự dịch chuyển của parabol.',
      },
      {
        step: 'Hoạt động 4',
        title: 'Vận dụng: Tính chiều cao cổng vòm trường học',
        duration: '5 phút',
        description: 'Bài toán cổng vòm parabol rộng 8m và cao 6m. Một xe tải chở hàng cao 4.5m có đi qua lọt được không? Giao bài tập về nhà.',
      },
    ],
  },
  {
    id: 'SRC-CD-10-VECTOR-DT',
    grade: 10,
    curriculum: 'Cánh Diều',
    chapter: 'Chương 7: Phương pháp tọa độ trong mặt phẳng',
    lessonTitle: 'Bài 2: Phương trình đường thẳng',
    sourceType: 'SGK Toán 10 Tập 2 - Cánh Diều (Trang 72-81)',
    contentSnippet: `NỘI DUNG TÀI LIỆU GỐC (SGK TOÁN 10 CÁNH DIỀU - PHƯƠNG TRÌNH ĐƯỜNG THẲNG):
1. Hoạt động Khởi động: Một máy bay bay theo đường thẳng từ vị trí A(1; 2) với vectơ hướng bay u = (3; 4). Làm sao để xác định vị trí máy bay tại thời điểm bất kỳ?
2. Vectơ chỉ phương và Vectơ pháp tuyến:
- Vectơ u != 0 có giá song song hoặc trùng với Delta gọi là vectơ chỉ phương.
- Vectơ n != 0 có giá vuông góc với Delta gọi là vectơ pháp tuyến. Mối liên hệ: nếu u = (a; b) thì n = (-b; a).
3. Các dạng phương trình:
- Phương trình tham số: x = x_0 + at, y = y_0 + bt.
- Phương trình tổng quát: ax + by + c = 0 (a^2 + b^2 > 0).
4. Vị trí tương đối giữa hai đường thẳng và công thức khoảng cách từ điểm M_0(x_0; y_0) đến đường thẳng Delta: d(M_0, Delta) = |ax_0 + by_0 + c| / sqrt(a^2 + b^2).`,
    keyFormulas: [
      '\\begin{cases} x = x_0 + at \\\\ y = y_0 + bt \\end{cases}',
      'ax + by + c = 0 \\quad (a^2 + b^2 > 0)',
      'd(M_0, \\Delta) = \\frac{|ax_0 + by_0 + c|}{\\sqrt{a^2 + b^2}}',
    ],
    realLifeApplication: 'Hàng hải và Hàng không: Thiết lập lộ trình bay tránh bão, định vị khoảng cách từ tàu thuyền đến bờ biển.',
    suggestedObjectives: {
      knowledge: [
        'Nêu được định nghĩa vectơ chỉ phương và vectơ pháp tuyến của đường thẳng.',
        'Lập thành thạo phương trình tham số và phương trình tổng quát của đường thẳng.',
        'Tính khoảng cách từ một điểm đến đường thẳng và xét vị trí tương đối giữa hai đường thẳng.',
      ],
      generalCompetencies: [
        'Năng lực tự chủ và tự học: Tự nghiên cứu mối quan hệ giữa vectơ chỉ phương và vectơ pháp tuyến.',
        'Năng lực giải quyết vấn đề: Thiết lập lộ trình bay an toàn bằng phương trình đường thẳng.',
      ],
      specificCompetencies: [
        'Năng lực mô hình hóa toán học: Biểu diễn chuyển động thẳng đều bằng phương trình tham số.',
        'Năng lực tư duy hình học giải tích.',
      ],
      qualities: ['Cẩn thận, chính xác trong các phép toán vectơ và tọa độ.'],
    },
    sampleActivities: [
      {
        step: 'Hoạt động 1',
        title: 'Khởi động: Lộ trình đường bay cứu hộ',
        duration: '7 phút',
        description: 'Tình huống trực thăng cứu hộ bay từ điểm xuất phát theo hướng vectơ định trước. Học sinh dự đoán tọa độ máy bay sau mỗi giờ bay.',
      },
      {
        step: 'Hoạt động 2',
        title: 'Hình thành kiến thức: Phương trình tham số & Tổng quát',
        duration: '23 phút',
        description: 'Xây dựng phương trình tham số và tổng quát. Hướng dẫn chuyển đổi qua lại giữa vectơ chỉ phương và vectơ pháp tuyến.',
      },
      {
        step: 'Hoạt động 3',
        title: 'Luyện tập: Lập phương trình đường thẳng đi qua 2 điểm',
        duration: '10 phút',
        description: 'Học sinh làm bài tập thực hành lập phương trình đường thẳng và tính khoảng cách từ điểm đến đường thẳng.',
      },
      {
        step: 'Hoạt động 4',
        title: 'Vận dụng: Tính bán kính phủ sóng trạm phát tín hiệu 5G',
        duration: '5 phút',
        description: 'Áp dụng công thức khoảng cách để kiểm tra đường cao tốc có nằm trong vùng phủ sóng trạm 5G hay không.',
      },
    ],
  },
  {
    id: 'SRC-KNTT-12-KSHS',
    grade: 12,
    curriculum: 'KNTT',
    chapter: 'Chương 1: Ứng dụng đạo hàm để khảo sát hàm số',
    lessonTitle: 'Bài 4: Khảo sát sự biến thiên và vẽ đồ thị hàm số',
    sourceType: 'SGK Toán 12 Tập 1 - Kết nối tri thức (Trang 24-35)',
    contentSnippet: `NỘI DUNG TÀI LIỆU GỐC (SGK TOÁN 12 KNTT - KHẢO SÁT HÀM SỐ):
1. Sơ đồ khảo sát hàm số:
- Bước 1: Tập xác định.
- Bước 2: Sự biến thiên: Chiều biến thiên (y'), Cực trị, Giới hạn tại vô cực và Tiệm cận (đứng, ngang, xiên), Bảng biến thiên.
- Bước 3: Vẽ đồ thị: Tọa độ các điểm đặc biệt (giao với Ox, Oy, tâm đối xứng, trục đối xứng).
2. Các dạng hàm số trọng tâm GDPT 2018:
- Hàm số bậc ba: y = ax^3 + bx^2 + cx + d (a != 0).
- Hàm phân thức bậc nhất / bậc nhất: y = (ax + b)/(cx + d).
- Hàm phân thức bậc hai / bậc nhất: y = (ax^2 + bx + c)/(px + q).
3. Ứng dụng thực tế: Khảo sát chi phí sản xuất tối thiểu, tối ưu hóa lợi nhuận kinh doanh của doanh nghiệp nông nghiệp tại Đồng Nai.`,
    keyFormulas: [
      'y = ax^3 + bx^2 + cx + d',
      'y = \\frac{ax + b}{cx + d} \\quad (c \\ne 0, ad - bc \\ne 0)',
      'y = \\frac{ax^2 + bx + c}{px + q}',
    ],
    realLifeApplication: 'Kinh tế & Tối ưu hóa: Tìm chi phí sản xuất thấp nhất, tối ưu diện tích bao bì đóng gói nông sản.',
    suggestedObjectives: {
      knowledge: [
        'Nắm vững quy trình 3 bước khảo sát sự biến thiên và vẽ đồ thị hàm số.',
        'Nhận diện các đường tiệm cận đứng, tiệm cận ngang, tiệm cận xiên.',
        'Ứng dụng đồ thị giải bài toán tối ưu hóa trong sản xuất và đời sống.',
      ],
      generalCompetencies: [
        'Năng lực tự chủ và tự học: Rèn luyện tính tự lập trong phân tích bài toán thực tế.',
        'Năng lực giải quyết vấn đề và sáng tạo.',
      ],
      specificCompetencies: [
        'Năng lực mô hình hóa toán học: Thiết lập hàm số chi phí và tối ưu bằng đạo hàm.',
        'Năng lực tư duy phân tích đồ thị.',
      ],
      qualities: ['Chăm chỉ, tư duy sắc bén, trách nhiệm với sản phẩm nhóm.'],
    },
    sampleActivities: [
      {
        step: 'Hoạt động 1',
        title: 'Khởi động: Bài toán chi phí sản xuất tối thiểu của công ty phân bón',
        duration: '6 phút',
        description: 'Tình huống thực tế lập hàm chi phí theo số lượng sản phẩm x. Dự đoán mức sản lượng mang lại chi phí tối ưu.',
      },
      {
        step: 'Hoạt động 2',
        title: 'Hình thành kiến thức: Sơ đồ 3 bước khảo sát hàm số',
        duration: '24 phút',
        description: 'Chuẩn hóa quy trình: TXĐ -> Sự biến thiên (đạo hàm, cực trị, tiệm cận) -> Bảng biến thiên -> Đồ thị.',
      },
      {
        step: 'Hoạt động 3',
        title: 'Luyện tập: Khảo sát hàm phân thức hữu tỉ trên MathHub',
        duration: '10 phút',
        description: 'Thực hành các bước khảo sát hàm phân thức $y = \\frac{2x - 1}{x + 1}$ và tìm giao điểm hai đường tiệm cận.',
      },
      {
        step: 'Hoạt động 4',
        title: 'Vận dụng: Thiết kế vỏ hộp sữa chua tiết kiệm vật liệu nhất',
        duration: '5 phút',
        description: 'Bài toán hình trụ có thể tích cho trước, tìm bán kính đáy để diện tích toàn phần nhỏ nhất.',
      },
    ],
  },
];
