# Group Feedback Synthesis

**Nguồn:** 12 phản hồi từ phiên phỏng vấn trực tiếp do Đỗ Thị Thanh Loan facilitate — người ngoài nhóm tự dùng bản prototype chạy local trên máy tính của Loan trong khi Loan xem trực tiếp thao tác và hỏi. Chi tiết từng phản hồi ở `prototype-feedback-note.md`.
**Giới hạn cần đọc trước:** đây là phiên đồng bộ, có facilitator quan sát trực tiếp đúng cấu trúc luật gốc của bài — nhưng hành vi cụ thể (first action, chỗ dừng, cách lấy lại control) không được ghi chép lại thành văn bản ngay lúc quan sát, nên vẫn thiếu lớp dữ liệu hành vi chi tiết dù có facilitator thật.

## Phân bố lựa chọn

| Option | Số người chọn | Ghi chú |
| --- | --- | --- |
| B — AI Review Queue | 5/12 | Được chọn nhiều nhất trong mẫu này |
| C — Proactive Agent | 4/12 | |
| A — Coach Query | 3/12 | |

Không dùng con số này như bằng chứng "B thắng" — mẫu 12 người tự chọn qua tin nhắn, không phải khảo sát đại diện, và cách hỏi (chọn 1 trong 3) khác với cách outcome task gốc yêu cầu (xác định nhóm cần ưu tiên rồi quyết định bước tiếp theo).

## Pattern lặp lại (xuất hiện ở ≥ 3 người, không phải ý kiến đơn lẻ)

| Pattern | Xuất hiện ở | Diễn giải |
| --- | --- | --- |
| Không rõ priority (Option B) được tính từ đâu | #1, #3, #9, #12 (4 người) | Cả người thích B lẫn người phân vân giữa B/C đều vấp cùng một chỗ — không phải vấn đề của riêng ai |
| Option A "an toàn hơn" nhưng tốn thao tác / khó scale cho lớp 50–60 | #4, #7, #11 (cả 3 người chọn A) | Khớp đúng trade-off nhóm đã dự đoán trong three-option-design-sheet.md — được xác nhận độc lập, không phải nhóm tự nghĩ ra |
| Lo ngại Option C: false positive, learner có biết đang bị AI theo dõi không, dễ nhầm "đang suy nghĩ" với "đang mắc kẹt" | #2, #5, #8, #10 (4 người) | Trùng với Still Unproven đã ghi trong cp1-evidence-continuity.md từ trước khi có feedback này |
| B và C dễ bị nhầm cơ chế nếu chỉ nhìn nhanh giao diện | #12 | Chỉ 1 người nói thẳng, nhưng đáng chú ý vì đây đúng là ranh giới quan trọng nhất giữa hai option |

## Một Next Change nhóm chốt

**Next Change:** Thêm một điểm giải thích ngắn ("Vì sao mức ưu tiên này?") gắn liền ngay cạnh mỗi priority tag ở Option B — hiện tại lý do priority đã có trong `AI_QUEUE_SUGGESTION.reason` (data.js) và hiển thị trong case detail, nhưng chưa hiển thị ngay ở màn hình queue tổng, nơi coach nhìn thấy priority đầu tiên. Đây là pattern có evidence rõ nhất (4/12 người, cả người thích lẫn không thích B đều vấp cùng chỗ), nên ưu tiên sửa trước các ý kiến đơn lẻ.

**Evidence dẫn tới quyết định này:** phản hồi #1, #3, #9, #12 — bốn người độc lập cùng nêu cùng một điểm mơ hồ, dù ba trong số họ chọn B (tức là ngay cả người thích option này vẫn không hiểu rõ cơ chế xếp hạng của nó).

## Still Unproven sau 12 phản hồi

- Cách hiển thị/giải thích priority nên như thế nào để đủ rõ mà không quá dài dòng — biết vấn đề, chưa biết giải pháp đúng.
- False positive ở Option C nên được xử lý/phục hồi ra sao ngoài Undo hiện có.
- Learner có cần được thông báo là AI đang theo dõi tín hiệu hành vi của họ không (câu hỏi consent, chưa nằm trong scope 3 prototype hiện tại).
- Loan có quan sát trực tiếp thao tác của 12 người này, nhưng không ghi log hành vi chi tiết theo thời gian thực — nên vẫn thiếu bằng chứng viết lại cho việc họ có thực sự làm đúng outcome task (xác định nhóm cần ưu tiên, quyết định bước hỗ trợ) hay chỉ đang so sánh 3 cơ chế trừu tượng.
- Trong 12 người có 1 Lab Coach thật (Lê Thiên Khang) — [CẦN XÁC NHẬN: phản hồi số mấy trong prototype-feedback-note.md] — nhưng chưa rõ đây có phải lúc đang trong ca dạy bận rộn hay không, và 11 người còn lại vẫn không rõ có ai từng làm vai trò tương tự không.

## Nguyên tắc khi đọc bảng trên

- Không dùng "5/12 chọn B" như bằng chứng B tốt hơn — chỉ là phân bố phản hồi thật, không phải kết quả đã kiểm định.
- Không tuyên bố solution đã được validated — 12 phản hồi giúp chọn Next Change tiếp theo, không chứng minh product value.
- Nếu có mâu thuẫn trong phản hồi (ví dụ #6 không thích C vì "can thiệp trước khi xem evidence" trong khi #2/#5/#8/#10 chọn C), giữ nguyên mâu thuẫn đó thay vì chọn bên đa số làm "sự thật".
