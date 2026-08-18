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
- Đọc lại trực tiếp 3 transcript Day 17 (do người dùng cung cấp) để audit ngược CP1/CP2/CP3 thay vì chỉ tin bản tóm tắt sẵn có; phát hiện 3 điểm cần Revise (chi tiết trong artifact audit report đã publish, link do người nộp giữ): (1) Hypothesis Problem gộp hai giai đoạn "đang diễn ra"/"vừa kết thúc" có evidence khác loại; (2) câu hỏi kiểm chứng cốt lõi ("coach có từng bỏ sót ai không") đã hỏi nhưng chưa được trả lời trong transcript May; (3) các con số cụ thể trong Common Scenario (Nhóm 07, 18 phút) không xuất hiện trong transcript gốc, là fixture thiết kế.
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

## Cam kết minh bạch

AI chỉ hỗ trợ phân tích, cấu trúc và soạn thảo. Evidence gốc đến từ tài liệu Day 17. Nhóm chịu trách nhiệm kiểm tra nội dung, build prototype, thực hiện test với người thật và ghi feedback trung thực.
