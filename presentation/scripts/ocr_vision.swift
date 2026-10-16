// IMG-02 보조: macOS Vision으로 이미지 속 글자(가짜 글자 포함)를 찾는다. tesseract가 없는 맥에서 OCR 대신 쓴다.
//   swift scripts/ocr_vision.swift a.jpg b.jpg …  → 표준 출력에 JSON 배열
// 이미지마다 recognized(읽힌 글줄: 글자·확신도·상자)와 regions(읽히지 않아도 글자처럼 생긴 영역 상자)를 낸다.
// 상자는 이미지 왼쪽 위 기준 0~1 비율이다. 맥이 아니거나 Vision이 없으면 이 스크립트는 실행되지 않고 검사기는 IMG-02를 수동으로 둔다.
import Foundation
import Vision
import AppKit

struct Box: Codable { let x: Double; let y: Double; let w: Double; let h: Double }
struct Line: Codable { let text: String; let conf: Double; let box: Box }
struct Out: Codable { let file: String; let width: Int; let height: Int; let recognized: [Line]; let regions: [Box]; let error: String? }

func box(_ r: CGRect) -> Box { Box(x: Double(r.minX), y: Double(1 - r.maxY), w: Double(r.width), h: Double(r.height)) }

var outs: [Out] = []
for path in CommandLine.arguments.dropFirst() {
  guard let img = NSImage(contentsOfFile: path), let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
    outs.append(Out(file: path, width: 0, height: 0, recognized: [], regions: [], error: "이미지를 열지 못함")); continue
  }
  let handler = VNImageRequestHandler(cgImage: cg, options: [:])
  let rec = VNRecognizeTextRequest()
  rec.recognitionLevel = .accurate
  rec.usesLanguageCorrection = false
  rec.recognitionLanguages = ["ko-KR", "en-US"]
  rec.minimumTextHeight = 0.008
  let rects = VNDetectTextRectanglesRequest()
  rects.reportCharacterBoxes = false
  var err: String? = nil
  do { try handler.perform([rec, rects]) } catch { err = "\(error)" }
  let lines: [Line] = (rec.results ?? []).compactMap { o in
    guard let c = o.topCandidates(1).first else { return nil }
    return Line(text: c.string, conf: Double(c.confidence), box: box(o.boundingBox))
  }
  let regions: [Box] = (rects.results ?? []).map { box($0.boundingBox) }
  outs.append(Out(file: path, width: cg.width, height: cg.height, recognized: lines, regions: regions, error: err))
}
let enc = JSONEncoder()
let data = try! enc.encode(outs)
print(String(data: data, encoding: .utf8)!)
