# Prototype Link — Day 18

**Người thực hiện:** Vũ Thế Lực (Option A, Option B, repo/common context)
**Trạng thái:** Prototype chạy được local; **chưa test với người thật, chưa có feedback**.

## Cách chạy local

Không cần build step, không cần backend, không cần cài package.

1. Mở thư mục `prototype/` trong repo.
2. Mở file `index.html` trực tiếp bằng trình duyệt (double-click, hoặc `start index.html` trên Windows), **hoặc** chạy một static server đơn giản nếu trình duyệt chặn `file://`:
   ```bash
   cd prototype
   npx serve .
   # hoặc: python -m http.server 8000
   ```
   rồi mở `http://localhost:3000` (hoặc cổng tương ứng).
3. Trang mở sẵn ở tab **Option A**. Dùng thanh tab trên header để chuyển sang **Option B**. Nút **"↺ Reset về common context"** ở góc phải header sẽ đưa cả hai option về trạng thái ban đầu bất cứ lúc nào.

## Link deploy

Chưa deploy online. Chỉ chạy local theo hướng dẫn trên.

## Đường dẫn file

| Option | File / entry point |
| --- | --- |
| Common context, tab switcher, layout | [prototype/index.html](prototype/index.html) |
| Style dùng chung cho A và B | [prototype/styles.css](prototype/styles.css) |
| Logic Option A + Option B | [prototype/app.js](prototype/app.js) |
| Data fixture dùng chung (lớp 50 learner, Checkpoint cài đặt, Nhóm 03/07/09, evidence) | [prototype/data.js](prototype/data.js) |

## Critical interaction — Option A (Coach Query / On-demand Assist)

1. Coach thấy danh sách 3 checkpoint của lớp (kèm số liệu tổng hợp kiểu-VLAB đã có sẵn, ví dụ "7/10 nhóm đã qua"), **AI chưa phân tích hay tổng hợp evidence gì ở mức nhóm**.
2. Coach chọn "Checkpoint 1 — Cài đặt môi trường" → nút "Kiểm tra nhóm đang chậm" mới bật lên.
3. Coach bấm nút → AI chỉ phân tích phạm vi checkpoint đó → trả về danh sách nhóm đang dừng (Nhóm 03, 07, 09), sắp theo thời gian dừng.
4. Coach bấm vào Nhóm 07 → xem evidence chi tiết (thời gian dừng, yêu cầu trợ giúp, số lần mở tài liệu, lịch sử hỗ trợ) kèm khối "Mức độ chắc chắn" giải thích rõ đây là tín hiệu gián tiếp.
5. Coach chọn **Hỗ trợ ngay / Lên lịch / Bỏ qua — chưa đủ evidence**. Có nút quay lại từng bước và nút reset toàn cục.

## Critical interaction — Option B (AI Review Queue / Coach Approves)

1. Coach mở tab, **AI đã tự tạo sẵn review queue** với 3 case (Nhóm 07, 09, 03), mỗi case có mức ưu tiên AI đề xuất kèm lý do — AI chưa liên hệ learner nào.
2. Coach mở case Nhóm 07 → đọc evidence + khối "Mức độ chắc chắn" giống Option A.
3. Coach có thể **chỉnh lại mức ưu tiên** (dropdown) và **bấm "+ Yêu cầu thêm evidence"** để xem dữ liệu bổ sung (so sánh với nhóm khác, lịch sử checkpoint trước, giới hạn dữ liệu).
4. Coach **Approve** (Hỗ trợ ngay / Lên lịch) hoặc **Dismiss — chưa đủ evidence**. Chỉ sau khi approve, màn hình mới hiện dòng xác nhận "bước hỗ trợ tiếp theo được tạo" — trong bản demo này đó chỉ là một câu xác nhận trên giao diện, chưa có hành động gửi thật nào chạy phía sau.
5. Có nút quay lại queue, quay lại case, và nút reset toàn cục.

## Điểm khác biệt cơ chế (không chỉ wording/layout)

- A: **Coach khởi tạo** phân tích, phạm vi do coach chọn, AI không tự xếp hạng gì trước khi được hỏi.
- B: **AI khởi tạo** review queue trước, tự xếp priority + giải thích, coach review/sửa/approve từng case; AI vẫn không tự liên hệ learner nếu chưa approve.
- Cả hai dùng chung: user (Lab Coach), lớp 50 learner, task, data fixture (Nhóm 03/07/09 tại Checkpoint 1), visual style, result choices, và reset path.

## Prototype annotation (nội bộ facilitator — không đọc/hiện cho tester)

**OPTION A — Coach Query**
- We expect the tester to: chủ động chọn checkpoint rồi bấm "Kiểm tra nhóm đang chậm" *trước khi* mong đợi thấy danh sách nhóm/evidence — nếu họ ngồi chờ thông tin tự hiện ra, đó là dấu hiệu cơ chế "on-demand" chưa rõ với họ.
- Watch for: tester có tự nhớ/biết phải bấm yêu cầu không hay cần được nhắc; mất bao lâu để chọn đúng checkpoint; họ có đọc khối "Mức độ chắc chắn" trước khi quyết định hay bỏ qua thẳng tới nút hành động; họ có so sánh cả 3 nhóm (03/07/09) hay chỉ nhìn Nhóm 07 vì thấy trước.
- Do not explain: không giải thích vì sao nút "Kiểm tra nhóm đang chậm" bị mờ ban đầu; không gợi ý nên chọn checkpoint nào; không đọc hộ nội dung evidence panel.

**OPTION B — AI Review Queue**
- We expect the tester to: mở tab thấy ngay review queue đã có sẵn, không cần bấm gì — nếu họ đi tìm một nút "quét"/"phân tích" như ở A, đó là dấu hiệu họ đang áp cơ chế A vào B.
- Watch for: tester có nhận ra queue là do AI tự tạo (đọc banner) hay coi đó là hiển nhiên; họ có bấm "+ Yêu cầu thêm evidence" trước khi quyết định hay chỉ nhìn priority AI đề xuất rồi làm theo; họ có tự đổi priority hay giữ nguyên đề xuất AI; họ có đọc dòng "chỉ sau khi approve mới tạo bước hỗ trợ" hay tưởng bấm là learner được liên hệ ngay.
- Do not explain: không giải thích vì sao Nhóm 07 được xếp priority Cao; không nói trước rằng có thể chỉnh priority; không diễn giải hộ khối "Mức độ chắc chắn".
