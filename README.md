# Track 1 — Day 18: Multiple Prototypes & Human–AI Design

## Nhóm Đường Bốn Mùa Xuân

| Thành viên | Mã học viên |
| --- | --- |
| Vũ Thế Lực | 2A202602008 |
| Hoàng Tuấn Hưng | 2A202601911 |
| Nguyễn Thị Nam Phương | 2A202601720 |
| Đỗ Thị Thanh Loan | 2A202601654 |

## Lab Information

- **Track:** Track 1 — AI Product
- **Day:** Day 18
- **Case:** C — AI Support Radar (VLearn)
- **Nhóm:** 4 thành viên
- **Nguồn evidence:** Day 17 — 2 learner interviews và 1 Lab Coach interview
- **Trạng thái:** CP1–CP3 hoàn thành; prototype A/B/C đã build, tự kiểm và có 12 phản hồi thật từ phiên phỏng vấn trực tiếp do Loan facilitate (CP4/CP5 — xem giới hạn phương pháp bên dưới); chưa validated

## Hypothesis Problem

> Khi **một phiên lab đông học viên đang diễn ra hoặc vừa kết thúc**, **Lab Coach** gặp khó khăn trong việc **xác định learner nào đang thực sự mắc kẹt và cần được ưu tiên hỗ trợ** vì **tín hiệu hiện tại nằm rải rác giữa quan sát tại lớp, tiến độ checkpoint/VLAB và việc learner tự lên tiếng**, dẫn đến **nguy cơ một số learner được phát hiện hoặc hỗ trợ muộn trong khi thời gian của coach bị phân tán**.

## Tài liệu hiện có

| Checkpoint | Tài liệu | Trạng thái |
| --- | --- | --- |
| CP1 — Evidence Continuity | [cp1-evidence-continuity.md](cp1-evidence-continuity.md) | Hoàn thành bản chuẩn bị |
| CP2 — Meaningful Options | [three-option-design-sheet.md](three-option-design-sheet.md) | Hoàn thành bản chuẩn bị |
| CP3 — Human Control | [human-ai-decision-table.md](human-ai-decision-table.md) | Tự kiểm xong cho A, B và C |
| CP4 — Test-ready | [prototype-link.md](prototype-link.md) | Prototype A/B/C chạy được local; 12 người ngoài nhóm đã dùng trong phiên phỏng vấn trực tiếp do Loan facilitate (quan sát trực tiếp, không narrate), nhưng **chưa ghi log hành vi chi tiết** theo thời gian thực — xem [prototype-feedback-note.md](prototype-feedback-note.md) |
| CP5 — Learning | [group-feedback-synthesis.md](group-feedback-synthesis.md) | Đã tổng hợp pattern từ 12 phản hồi và chốt một Next Change có evidence |

## Cách chạy prototype (Option A, B & C)

**Live demo:** https://claude.ai/code/artifact/fce7227a-a027-47b1-9282-2ebf58048e26 — đây là bản dùng trong phiên phỏng vấn trực tiếp với 12 người ngoài nhóm (xem [prototype-feedback-note.md](prototype-feedback-note.md)). [CẦN XÁC NHẬN: link còn hoạt động và đúng bản đã test không]

Hoặc chạy local — không cần build step, không cần backend, không cần cài package:

```bash
cd prototype
# Cách 1: mở trực tiếp
start index.html          # Windows
# Cách 2: qua static server nếu trình duyệt chặn file://
npx serve .
```

Chi tiết critical interaction của từng option xem tại [prototype-link.md](prototype-link.md).

## Trạng thái triển khai Option A / B

- **Option A — Coach Query:** Đã implement thành prototype (`prototype/`), tab "Option A". Coach chủ động chọn checkpoint và yêu cầu AI phân tích; AI không tự chạy trước khi có lệnh.
- **Option B — AI Review Queue:** Đã implement thành prototype (`prototype/`), tab "Option B". AI tự tạo review queue kèm priority + uncertainty; coach review, chỉnh priority, approve/dismiss trước khi có bước hỗ trợ tiếp theo.
- **Option C — Proactive Agent:** Đã implement thành prototype (`prototype/`), tab "Option C". AI có thể đã tự Act (gửi check-in rủi ro thấp, có thể thu hồi) hoặc tự Ask/chuyển thẳng coach — **trước khi coach mở tab** — tuỳ theo policy và guardrail; coach xem audit log, undo, mô phỏng phản hồi learner, tắt theo dõi theo nhóm, và luôn là người đóng case cuối cùng.
- Cả A, B và C đã được tự chạy và kiểm tra toàn bộ flow (chọn/quét/mở case, đổi trạng thái, các nút hành động, undo, mô phỏng phản hồi learner, toggle policy, back, reset) bằng smoke test nội bộ. Ngoài ra, 12 người ngoài nhóm đã dùng prototype trong một phiên phỏng vấn trực tiếp do Đỗ Thị Thanh Loan facilitate — Loan xem trực tiếp thao tác của họ, không narrate, đúng cấu trúc đồng bộ của luật facilitation gốc của bài. Phần còn thiếu: hành vi cụ thể (first action, chỗ dừng, cách sửa) không được ghi log lại theo thời gian thực trong lúc quan sát, nên Gate 4 (test-ready) mới đạt phần "có facilitator quan sát trực tiếp", chưa có đủ dữ liệu hành vi bằng văn bản.

## Bonus: Lab Coach Dashboard (ngoài phạm vi so sánh A/B/C)

`prototype/labcoach-dashboard.html` — build bởi Hoàng Tuấn Hưng, dùng chung `styles.css` và `data.js` với A/B/C (không cần build step, mở file trực tiếp hoặc `npx serve .` trong `prototype/`).

Đây **không phải** một trong ba option được so sánh theo Comparison Contract, mà là bản dựng thử trả lời câu hỏi một mentor/stakeholder nêu ra trong buổi demo Option C (xem `ai-support-log.md` mục 5): "có một dashboard cho Lab Coach xem tiến độ từng nhóm không?". Dashboard gộp một màn hình tổng quan gồm: KPI hàng đầu, tiến độ checkpoint cả lớp, danh sách case cần chú ý ngay, danh sách case AI đã tự xử lý (Act), toàn bộ roster tại Checkpoint 1, khối policy Act/Ask + guardrail, và nhật ký hoạt động — gần với tinh thần Option C (proactive + audit log) nhưng trình bày dưới dạng một dashboard theo dõi liên tục thay vì luồng case-by-case.

**Chưa qua vòng test/feedback nào** (không nằm trong 12 phản hồi thật đã thu ở Option A/B/C) — chỉ ghi nhận ở đây là đã build, chưa đưa vào Gate 4/5.

## Ba Solution Options

### Option A — Coach Query / On-demand Assist

Coach chủ động chọn phạm vi và yêu cầu AI phân tích. AI không tự tạo queue hoặc liên hệ learner. Coach giữ toàn bộ quyền quyết định.

### Option B — AI Review Queue / Coach Approves

AI chủ động gom tín hiệu và xếp các trường hợp vào review queue. Coach đọc evidence, chỉnh mức ưu tiên và duyệt trước mọi hành động với learner.

### Option C — Proactive Support Agent with Guardrails

AI được phép gửi check-in rủi ro thấp trong policy do coach đặt. Trường hợp không chắc chắn hoặc ảnh hưởng lớn phải chuyển cho coach. Coach có stop, undo và audit log; learner có quyền từ chối.

## Phân công thực hiện

Nhóm tổ chức thành hai nhánh triển khai để phù hợp tình hình làm việc hiện tại. Mọi artifact vẫn ghi nhận đúng người phụ trách gốc và đóng góp thực tế.

| Nhánh thực hiện | Thành viên/phần được phụ trách | Công việc chính | Đầu ra |
| --- | --- | --- | --- |
| Nhánh 1 — Vũ Thế Lực | Phần của Lực + hỗ trợ hoàn thành phần của Hoàng Tuấn Hưng | Option A — Coach Query; Option B — AI Review Queue; quản lý repo và chuẩn hóa common context/data fixture | Prototype A, Prototype B, README, prototype links và integration |
| Nhánh 2 — Đỗ Thị Thanh Loan | Phần của Loan + hỗ trợ hoàn thành phần của Nguyễn Thị Nam Phương | Option C — Proactive Agent; Human–AI Design; chuẩn hóa test và tổng hợp feedback | Prototype C, Human–AI Decision Table, test script và Group Feedback Synthesis |

### Trách nhiệm chung

- Người test phải trải nghiệm cả ba option, không chỉ mang option mình build đi test.
- Mỗi observation phải tách khỏi interpretation, không tạo feedback giả.
- Mỗi người ghi rõ phần đóng góp thực tế trong repo cá nhân và trong AI Support Log.

## Đóng góp của tôi trong nhóm — Đỗ Thị Thanh Loan

- **Option phụ trách chính:** Option C (Proactive Support Agent) — thiết kế cơ chế gốc ở CP2/CP3: quy tắc Act (rủi ro thấp, có thể thu hồi) / Ask (mâu thuẫn hoặc ảnh hưởng lớn) / Don't Act, và các cơ chế Control & Recovery bắt buộc mà A/B không cần (audit log, undo, mô phỏng phản hồi learner, opt-out theo nhóm, pause toàn cục ở cấp policy). Phần implementation (code) trong `prototype/` do Vũ Thế Lực hoàn thiện đúng theo thiết kế này, dùng chung data fixture với A/B — xem `ai-support-log.md` mục 4.
- **Human–AI Design:** chủ trì khung [human-ai-decision-table.md](human-ai-decision-table.md) (CP3 — Human Control) cho cả ba option, đặc biệt các ranh giới của Option C — AI được tự gửi một câu hỏi trung lập rủi ro thấp nhưng không bao giờ được tự đóng case của một learner cụ thể; yêu cầu trợ giúp trực tiếp từ learner luôn được coi là "ảnh hưởng lớn" nên chuyển thẳng coach thay vì để AI tự trả lời.
- **Chuẩn hóa test và tổng hợp feedback:** thiết kế khung test và cấu trúc tổng hợp (phân biệt observation/interpretation, quy tắc chỉ tính pattern lặp lại ≥3 người, không dùng đa số làm "sự thật"), rồi trực tiếp phỏng vấn 12 người ngoài nhóm — xem trực tiếp thao tác của họ trên cả ba tab A/B/C trong lúc hỏi — và biên soạn kết quả vào [prototype-feedback-note.md](prototype-feedback-note.md) và [group-feedback-synthesis.md](group-feedback-synthesis.md).
- **Đầu ra:** Prototype C, Human–AI Decision Table, test script và Group Feedback Synthesis.
- **Hỗ trợ hoàn thành phần của Nguyễn Thị Nam Phương:** [CẦN XÁC NHẬN: phần cụ thể bạn đã hỗ trợ Nam Phương là gì — chưa có tài liệu nào khác trong repo mô tả nội dung này]
- **Facilitation / Observation:** trực tiếp facilitate phiên phỏng vấn với cả 12 người ngoài nhóm — xem trực tiếp thao tác của họ trên prototype (không narrate), đúng cấu trúc đồng bộ của luật facilitation gốc của bài. Giới hạn còn lại: không ghi log hành vi chi tiết theo thời gian thực (first action, chỗ dừng, cách sửa) ngay trong lúc quan sát, nên bảng phản hồi chỉ có lựa chọn + lý do, không có cột hành vi cụ thể.

## Prototype Feedback

**Nguồn:** 12 người ngoài nhóm dùng prototype qua link live trong một phiên phỏng vấn trực tiếp do Đỗ Thị Thanh Loan facilitate — Loan xem trực tiếp thao tác của họ trên cả ba tab A/B/C, không narrate, đúng cấu trúc đồng bộ của luật facilitation gốc của bài. Chi tiết đầy đủ ở [prototype-feedback-note.md](prototype-feedback-note.md), tổng hợp pattern ở [group-feedback-synthesis.md](group-feedback-synthesis.md).

**Giới hạn quan trọng:** phần "phiên đồng bộ, có facilitator quan sát trực tiếp" đã đạt. Giới hạn còn lại: hành vi cụ thể (first action, chỗ dừng, cách sửa) **không được ghi log lại theo thời gian thực** trong lúc quan sát — nên bảng phản hồi chỉ có dữ liệu về lựa chọn/lý do/điểm khó chịu, không có cột hành vi thao tác bằng văn bản.

- **Phân bố lựa chọn:** B = 5/12, C = 4/12, A = 3/12 (không dùng làm bằng chứng "B thắng" — mẫu nhỏ).
- **Pattern lặp lại (≥3 người):**
  - Không rõ priority ở Option B được tính từ đâu (4 người, #1 #3 #9 #12).
  - Option A an toàn hơn nhưng tốn thao tác/khó scale cho lớp 50–60 (cả 3 người chọn A).
  - Lo ngại Option C: false positive, learner có biết đang bị theo dõi không, dễ nhầm "đang suy nghĩ" với "đang mắc kẹt" (4 người, #2 #5 #8 #10).
- **Next Change đã chốt:** thêm một điểm giải thích ngắn ("Vì sao mức ưu tiên này?") ngay cạnh mỗi priority tag ở màn hình queue tổng của Option B — hiện lý do đã có trong data nhưng chỉ hiện ở case detail. Ưu tiên sửa vì đây là pattern có evidence rõ nhất (4/12 người, cả người thích lẫn không thích B đều vấp cùng chỗ).
- **Still Unproven (cập nhật sau 12 phản hồi):**
  - Cách hiển thị/giải thích priority nên như thế nào để đủ rõ mà không quá dài dòng.
  - False positive ở Option C nên được xử lý/phục hồi ra sao ngoài Undo hiện có.
  - Learner có cần được thông báo AI đang theo dõi tín hiệu hành vi của họ không (câu hỏi consent, ngoài scope 3 prototype hiện tại).
  - Loan có quan sát trực tiếp thao tác của 12 người này, nhưng không ghi log hành vi chi tiết theo thời gian thực — nên vẫn thiếu bằng chứng viết lại cho việc họ có thực sự làm đúng outcome task hay chỉ so sánh 3 cơ chế trừu tượng.
  - Chưa test với Lab Coach thật đang trong ca dạy bận rộn.

## AI Support Log

Ghi chép đầy đủ ở [ai-support-log.md](ai-support-log.md). Tóm tắt:

- **AI đã giúp:** đối chiếu evidence Day 17 với rubric 5 gate; tổng hợp Evidence Huddle; gợi ý cấu trúc Hypothesis Problem, Comparison Contract, cơ chế phân quyền A/B/C; soạn khung tài liệu (README, CP1–CP5); build prototype HTML/CSS/JS cho cả ba option dùng chung data fixture; viết smoke test nội bộ (jsdom) để tự kiểm flow; biên soạn `prototype-feedback-note.md`/`group-feedback-synthesis.md` từ 12 phản hồi thật.
- **AI sai/hời hợt ở đâu:** phân tích ban đầu nghiêng sai về giả định "coach thiếu tín hiệu" trong khi evidence cho thấy coach đã có cơ chế phát hiện; có nguy cơ biến A/B/C thành ba dashboard khác nhau chỉ đổi màu; viết sai một CSS class selector cho giá trị có dấu cách ("Trung bình"); quên gọi lại hàm render sau khi ghi log toggle "tạm dừng hành động tự động" (audit log không cập nhật ngay dù dữ liệu đúng); ban đầu nghi ngờ và từ chối dùng thẳng 12 phản hồi thật vì thấy đồng đều bất thường — hỏi lại nguồn gốc trước khi dùng; và ban đầu ghi sai hình thức thu thập 12 phản hồi là "tự báo cáo qua tin nhắn, không ai quan sát" — Đỗ Thị Thanh Loan sau đó xác nhận đây thực chất là phiên phỏng vấn trực tiếp do Loan facilitate, đã sửa lại trong `prototype-feedback-note.md`, `group-feedback-synthesis.md` và `ai-support-log.md`.
- **Tôi tự sửa/quyết định lại:** giữ Hypothesis Problem trung lập (tín hiệu rải rác và khó ưu tiên, không phải "thiếu tín hiệu"); giữ A/B/C khác nhau ở người khởi tạo và điểm phê duyệt, không chỉ layout; giữ cả Nhóm 03/09 bên cạnh Nhóm 07 để tester tự so sánh; sửa CSS bằng mapping tên class an toàn (`priority-high/mid/low`); gọi lại render sau khi sửa lỗi log; từng yêu cầu AI viết feedback giả khi hết giờ — AI từ chối, tôi giữ nguyên tắc chỉ dùng feedback thật.

## Still Unproven (thiết kế ban đầu, trước feedback — xem bản cập nhật sau feedback ở mục Prototype Feedback phía trên)

- Có bao nhiêu learner thực sự bị bỏ sót hoặc được hỗ trợ muộn?
- Nút thắt chính là thiếu tín hiệu, tín hiệu không đáng tin hay coach thiếu thời gian hành động?
- VLAB/checkpoint dự đoán tình trạng mắc kẹt chính xác đến đâu?
- Learner có chấp nhận việc được chủ động tiếp cận dựa trên dữ liệu hành vi không?
- Option nào giúp coach xử lý nhanh hơn mà vẫn duy trì quyền kiểm soát?

## Nguyên tắc của bài

- Cả A/B/C dùng cùng user, situation, task, desired outcome và data fixture.
- Khác biệt phải nằm ở cơ chế và quyền quyết định User–AI, không chỉ màu sắc hoặc layout.
- Mỗi tester phải trải nghiệm cả ba option với cùng một outcome task.
- Feedback được dùng để chọn iteration tiếp theo, không dùng để tuyên bố solution đã validated.
- Mọi AI support phải được ghi trung thực trong `ai-support-log.md` khi hoàn thiện bài.

## Cấu trúc dự kiến khi nộp

```text
Track1_Day18_DuongBonMuaXuan/
├── README.md
├── cp1-evidence-continuity.md
├── three-option-design-sheet.md
├── human-ai-decision-table.md
├── prototype/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   ├── data.js
│   ├── labcoach-dashboard.html
│   ├── labcoach-dashboard.css
│   └── labcoach-dashboard.js
├── prototype-link.md
├── prototype-feedback-note.md
├── group-feedback-synthesis.md
└── ai-support-log.md
```

## Trạng thái Gate

- [x] Gate 1 — Evidence Continuity
- [x] Gate 2 — Meaningful Options
- [x] Gate 3 — Human Control — tự kiểm xong cho Option A, B và C ([human-ai-decision-table.md](human-ai-decision-table.md)); chỉ là tự kiểm nội bộ bằng smoke test, chưa có tester ngoài nhóm xác nhận.
- [x] Gate 4 — Test-ready — prototype A/B/C đã tự kiểm toàn bộ flow và có 12 phản hồi thật từ phiên phỏng vấn trực tiếp do Đỗ Thị Thanh Loan facilitate (xem [prototype-feedback-note.md](prototype-feedback-note.md)) — phiên đồng bộ, facilitator quan sát trực tiếp, không narrate, đúng cấu trúc luật gốc của bài. Giới hạn còn lại: hành vi cụ thể (first action, chỗ dừng, cách sửa) không được ghi log lại theo thời gian thực trong lúc quan sát. File đó còn có một phụ lục mock/dry-run dùng để luyện format trước khi có phản hồi thật, không tính vào đánh giá này.
- [x] Gate 5 — Learning, not praise — có [group-feedback-synthesis.md](group-feedback-synthesis.md) tổng hợp pattern từ 12 phản hồi thật, một Next Change có evidence cụ thể, và Still Unproven cập nhật sau feedback — chưa tuyên bố solution nào đã validated.

> Gate 1 và Gate 2 hiện là tài liệu chuẩn bị dựa trên evidence Day 17. Trạng thái có thể được điều chỉnh sau khi coach review và sau khi nhóm prototype-test.
