# AI Support Log — Day 18

**Người nộp:** Vũ Thế Lực — 2A202602008  
**Case:** C — AI Support Radar (VLearn)

## 1. AI đã giúp tôi ở đâu?

- Đọc và đối chiếu tài liệu Day 17 với rubric năm gate của Day 18.
- Tổng hợp ba Practice Notes thành Evidence Huddle, tách observation khỏi interpretation.
- Gợi ý cấu trúc Hypothesis Problem đủ situation, user, job, barrier và consequence.
- Gợi ý Solution Parking Lot, Comparison Contract và ba cơ chế phân quyền User–AI cho Option A/B/C.
- Soạn khung README, checklist CP1/CP2 và cấu trúc repo nộp bài.
- Build micro-prototype HTML/CSS/JS thuần cho Option A (Coach Query) và Option B (AI Review Queue), dùng chung một data fixture (lớp 50 learner, Checkpoint 1 — Cài đặt môi trường, Nhóm 03/07/09) theo đúng Comparison Contract ở CP2.
- Viết một smoke test nội bộ (jsdom, chạy rồi xoá khỏi repo) để tự kiểm tra toàn bộ flow của A và B trước khi báo hoàn thành: chọn checkpoint, quét, mở evidence, đổi priority, yêu cầu thêm evidence, approve/dismiss, back, reset — không phát hiện lỗi JS runtime.
- Soạn `prototype-link.md` và `human-ai-decision-table.md`, cập nhật README theo đúng trạng thái thật (Gate 4 chưa pass vì chưa có tester ngoài nhóm).
- Tôi đọc lại trực tiếp 3 transcript Day 17 (mình cung cấp trong hội thoại) để audit ngược CP1/CP2/CP3, thay vì chỉ tin bản tóm tắt sẵn có. Từ đó phát hiện 3 điểm cần Revise, chi tiết nằm trong artifact audit report đã publish (link tôi đang giữ). Thứ nhất, Hypothesis Problem đang gộp hai giai đoạn "đang diễn ra" và "vừa kết thúc" nhưng evidence cho hai giai đoạn này khác loại nhau. Thứ hai, câu hỏi kiểm chứng cốt lõi — coach có từng bỏ sót ai không — đã được hỏi trong transcript May nhưng chưa có câu trả lời. Thứ ba, các con số cụ thể trong Common Scenario (Nhóm 07, 18 phút) không xuất hiện trong transcript gốc — đó là fixture thiết kế, không phải số liệu thật.
- Áp dụng các sửa chữa an toàn từ audit (không đổi Hypothesis Problem — việc đó cần cả nhóm quyết định): thêm disclaimer fixture-vs-evidence vào `three-option-design-sheet.md` và `prototype/data.js`; sửa câu "AI chưa chạy gì" thành diễn đạt chính xác hơn ("AI chưa phân tích/tổng hợp evidence") ở `prototype-link.md`/`human-ai-decision-table.md`; thêm nuance "đã hỏi, chưa có câu trả lời" vào `cp1-evidence-continuity.md` mục Still Unproven.

## 2. AI sai, hồi hộp hoặc làm các option giống nhau ở đâu?

- Phân tích ban đầu nghiêng về giả định coach thiếu tín hiệu, trong khi evidence cho thấy coach đã đi từng bàn và dùng VLAB/checkpoint.
- Có nguy cơ biến A/B/C thành ba phiên bản dashboard khác nhau. Nhóm đã yêu cầu khác nhau ở người khởi tạo, quyền hành động và điểm phê duyệt.
- AI ban đầu tạo thư mục Day 18 nhóm trong repo Day 17, không đúng repo cá nhân đã được tạo sẵn.
- Khi viết CSS ban đầu cho badge priority của Option B, AI viết một selector class sai cú pháp cho giá trị có dấu cách ("Trung bình") khiến style không áp dụng đúng — đã phát hiện và đổi sang mapping tên class an toàn (`priority-high/mid/low`) trước khi test.
- AI chưa có feedback tester thật; mọi failure assumption và Next Change hiện chỉ là kế hoạch test, không phải kết quả. Smoke test chỉ xác nhận flow không lỗi kỹ thuật, không thay thế được việc quan sát người dùng thật quyết định như thế nào.

## 3. Tôi đã tự sửa hoặc quyết định lại điều gì?

- Giữ evidence coach đã có cơ chế phát hiện, không viết rằng coach hoàn toàn không có tín hiệu.
- Chọn Hypothesis Problem trung lập hơn: tín hiệu rải rác và khó ưu tiên, thay vì khẳng định pain chỉ là thiếu tín hiệu.
- Giữ A là user-led, B là co-create và C là proactive agent để tạo khác biệt cơ chế thật.
- Quyết định tổ chức công việc thành hai nhánh: Lực thực hiện phần của Lực và hỗ trợ phần Hưng; Loan thực hiện phần của Loan và hỗ trợ phần Nam Phương.
- Trong prototype, quyết định giữ cả Nhóm 03 và Nhóm 09 bên cạnh Nhóm 07 (thay vì chỉ hiện một nhóm "đúng đáp án"), để tester phải tự so sánh evidence và tự quyết định ai cần ưu tiên, đúng yêu cầu outcome task chứ không bị dẫn sẵn.
- Không điền `prototype-feedback-note.md` và `group-feedback-synthesis.md` vì chưa test với người thật; không đánh dấu Gate 4 pass trong README dù prototype đã tự chạy được đầy đủ.
- Chưa chọn option thắng và chưa ghi feedback/observation chưa diễn ra.

## 4. Cập nhật bổ sung — build Option C (Proactive Support Agent)

- AI đã giúp thiết kế và code prototype Option C trong cùng bộ file `prototype/` (data.js, app.js, index.html, styles.css) để giữ đúng data fixture chung với A/B (Nhóm 03/07/09, Checkpoint 1), theo đúng phân công CP2/CP3 thuộc phần Loan.
- Quyết định cơ chế cụ thể để tránh việc C chỉ là "B đổi tên": Nhóm 07 (tín hiệu mạnh nhưng mâu thuẫn — dừng lâu và mở tài liệu nhiều lần, nhưng chưa xin giúp) được AI **tự Act** — tự gửi một check-in trung lập, rủi ro thấp, có thể thu hồi, ngay cả trước khi coach mở tab; Nhóm 09 (learner đã tự gửi yêu cầu trợ giúp) được coi là **ảnh hưởng lớn** nên AI **không tự trả lời**, chuyển thẳng cho coach (Ask); Nhóm 03 (tín hiệu bình thường) thì AI **không hành động** (Don't Act), chỉ ghi log theo dõi. Đây là diễn giải cụ thể hoá quy tắc "Act rủi ro thấp / Ask khi mâu thuẫn hoặc ảnh hưởng lớn" đã có trong `three-option-design-sheet.md`, áp dụng đúng lên ba case sẵn có thay vì bịa thêm dữ liệu mới.
- Thêm các cơ chế Control & Recovery mà thiết kế CP2 yêu cầu nhưng A/B không cần: audit log hiển thị mọi hành động AI đã tự làm/tự quyết định không làm, nút thu hồi (undo) check-in trước khi có phản hồi, mô phỏng phản hồi learner (gắn nhãn rõ là mô phỏng, không phải dữ liệu thật), toggle tắt theo dõi chủ động theo từng nhóm, và toggle tạm dừng toàn bộ hành động tự động ở cấp policy.
- Viết lại smoke test nội bộ bằng jsdom (cài tạm trong scratchpad, không đưa vào repo) để tự kiểm 15 kịch bản: chuyển tab, mở case theo 3 nhánh Act/Ask/Don't-Act, undo, mô phỏng learner đồng ý/từ chối, toggle opt-out và pause có ghi log đúng không, reset đưa log về đúng 3 dòng ban đầu, và hồi quy — xác nhận Option A/B vẫn chạy đúng sau khi thêm Option C.
- **AI sai một lần trong khi tự kiểm:** toggle "tạm dừng hành động tự động" ghi log vào mảng dữ liệu nhưng quên gọi lại hàm render, nên audit log hiển thị không cập nhật ngay dù dữ liệu đã đúng — smoke test phát hiện, đã sửa bằng cách gọi render lại activity feed ngay sau khi ghi log.
- Cập nhật `README.md`, `human-ai-decision-table.md` (thay toàn bộ cột "(Thiết kế, chưa test)" bằng mô tả implementation thật), `prototype-link.md` (thêm Critical interaction và facilitator annotation cho C) để phản ánh đúng: Option C đã implement và tự kiểm được cho Gate 3, nhưng Gate 4/5 vẫn chưa đạt vì chưa có tester ngoài nhóm và chưa có feedback thật.

## 5. Phản hồi từ một buổi demo với mentor/stakeholder (không tính là test Chặng 6)

Có một buổi mình (Lực) demo prototype Option C cho một người có vai trò cao hơn trong chương trình (gọi là "anh" trong đoạn ghi âm — có khả năng quyết định đề xuất giải pháp lên VLAB thật). Đây là **buổi demo có người dẫn**: mình thao tác và giải thích trong lúc anh xem, hỏi, phản hồi — không phải anh tự bấm prototype một mình. Vì vậy nó **không thay thế** được cho 3 Feedback Note bắt buộc ở Chặng 6 (yêu cầu tester tự điều khiển, facilitator không narrate) — chỉ ghi lại đây làm input tham khảo, tách rõ observation khỏi diễn giải.

**Observed — anh thực sự nói/hỏi gì:**
- Hỏi thẳng "tại sao lại phải đưa vào hàng đợi?" khi thấy AI đã tổng hợp tín hiệu — ban đầu nhầm lẫn cơ chế giữa Option A và B.
- Sau khi nghe giải thích Act/Ask/Don't-Act ở Option C, tự đưa ra ví von: AI như "siêu xe không phanh trên cao tốc"; nêu lý do ủng hộ nút dừng khẩn cấp là AI có thể "ảo giác" và việc hỗ trợ học viên ảnh hưởng trực tiếp tới công việc/lương của Lab Coach nên không thể để AI toàn quyền.
- Xem case Nhóm 07 (Act), nhận xét giao diện "hơi nhiều text quá, nhìn phát chưa nắm được tình hình" — muốn dạng bullet point để quét nhanh.
- Hỏi rõ hệ thống "có thay thế được lắp code không?" — xác nhận không, chỉ hỗ trợ.
- Tự diễn giải lại đúng vấn đề gốc: có nhóm mạnh dạn giơ tay xin giúp, có nhóm rụt rè giấu vấn đề, gây khó khăn cho cả việc học lẫn việc lắp code hỗ trợ hợp lý.
- Kết luận "về mặt ý tưởng là ok", đề xuất áp dụng vào VLAB thật, hứa đề xuất lên; hỏi thêm về một dashboard cho Lab Coach xem tiến độ từng nhóm — được biết dashboard đó "đã build nhưng chưa đẩy lên" repo.

**Interpreted — không coi là fact:**
- "Hữu ích" là phản ứng của một người xem demo có người dẫn, chưa phải learner hay Lab Coach thật tự dùng độc lập — không suy ra learner/coach nói chung sẽ phản ứng giống vậy.
- Việc anh hiểu đúng Act/Ask/Don't-Act sau khi được giải thích không chứng minh giao diện tự nó đủ rõ; câu hỏi "tại sao phải xếp hàng đợi" lúc đầu cho thấy nếu không có người dẫn, dễ nhầm cơ chế giữa các option — đúng loại nhầm lẫn mà một phiên test Chặng 6 thật (không narrate) cần đo, chưa đo được ở đây vì có người giải thích.

**Việc cần làm rút ra, không phải feedback:**
- Kiểm tra với Hưng có một "dashboard cho Lab Code" đã build cục bộ nhưng chưa push lên repo — nên xác nhận và đẩy lên nếu có, vì có thể là phần thiếu trong bài nộp.
- Góp ý "quá nhiều chữ, muốn bullet point" trùng với hướng bản redesign UI của Hưng đã làm — chưa xác nhận được thứ tự thời gian giữa buổi demo này và bản redesign.
- Ý tưởng nút like/dislike phía learner để thu thập metric cho đề xuất của AI mới chỉ là ý tưởng nêu ra, chưa build, chưa đưa vào scope hiện tại.

## 6. Xử lý 12 phản hồi thật từ người ngoài nhóm

- Tôi cung cấp 12 phản hồi thật (người ngoài nhóm tự mở link prototype live, tự dùng cả A/B/C, tự báo lại lựa chọn + lý do qua tin nhắn) cho AI để viết vào `prototype-feedback-note.md` và `group-feedback-synthesis.md`.
- AI ban đầu nghi ngờ và từ chối dùng thẳng, vì 12 câu trả lời khá đồng đều về cấu trúc và có vài điểm trùng khớp bất thường với chính giới hạn AI đã viết sẵn trong app (ví dụ lo ngại về việc hiểu nhầm thời gian dừng checkpoint). AI hỏi lại nguồn gốc trước khi dùng — tôi xác nhận đây là người thật.
- AI giữ nguyên tắc: chỉ ghi phần thật sự có dữ liệu (lựa chọn, lý do, điểm khó chịu), để trống các cột hành vi quan sát (first action, cách lấy lại control...) vì đây là tự báo cáo qua tin nhắn, không có ai quan sát trực tiếp — không suy đoán thêm hành vi không có thật.
- AI tổng hợp pattern chỉ từ những điểm lặp lại ở nhiều người (≥3), không dùng ý kiến đơn lẻ làm kết luận chung; chốt một Next Change (thêm giải thích "vì sao priority này" ngay ở màn hình queue) dựa trên pattern có evidence rõ nhất (4/12 người cùng vướng một chỗ).
- Trước đó tôi từng yêu cầu AI tự viết feedback giả vì hết giờ; AI từ chối và giải thích đây là điều đề bài cấm rõ nhất, thay vào đó chuẩn bị sẵn khung điền và kịch bản test nhanh. Ghi lại ở đây cho trung thực, dù cuối cùng có được feedback thật để dùng.

**Đính chính (sau khi Loan xác nhận trực tiếp trong một phiên khác):** mô tả "tự báo lại qua tin nhắn, không có ai quan sát trực tiếp" ở trên là hiểu chưa đúng lúc đó. Thực tế Đỗ Thị Thanh Loan là người trực tiếp phỏng vấn và xem thao tác của 12 người này (facilitator có mặt, quan sát trực tiếp) — đã sửa lại đúng ở `prototype-feedback-note.md` và `group-feedback-synthesis.md`. Phần còn thiếu thật sự chỉ là: hành vi cụ thể (first action, chỗ dừng, cách sửa) không được ghi log lại theo thời gian thực trong lúc quan sát.

## Cam kết minh bạch

AI hỗ trợ tôi ở phần phân tích, cấu trúc tài liệu và soạn thảo câu chữ. Evidence gốc vẫn là từ ba transcript Day 17, không phải AI tạo ra. Tôi và nhóm chịu trách nhiệm kiểm tra lại nội dung, build prototype, test với người thật và ghi feedback đúng như những gì quan sát được.
