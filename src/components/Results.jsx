// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const Results = ({ scriptScores, questionnaireScores, combinedScores, mImages }) => {
//   if (!scriptScores) return null;

//   const scriptData = {
//     labels: Object.keys(scriptScores),
//     datasets: [
//       {
//         label: 'Script Analysis',
//         data: Object.values(scriptScores),
//         backgroundColor: 'rgba(54, 162, 235, 0.5)',
//       }
//     ]
//   };

//   const combinedData = {
//     labels: Object.keys(combinedScores || {}),
//     datasets: [
//       {
//         label: 'Combined Analysis',
//         data: Object.values(combinedScores || {}),
//         backgroundColor: 'rgba(75, 192, 192, 0.5)',
//       }
//     ]
//   };

//   return (
//     <div className="results-container">
//       <h2>Analysis Results</h2>
      
//       <div className="result-section">
//         <h3>Script Analysis Results</h3>
//         <div className="chart-container">
//           <Bar data={scriptData} />
//         </div>
//         <div className="scores-display">
//           {Object.entries(scriptScores).map(([pattern, score]) => (
//             <div key={pattern} className="score-item">
//               <span className="pattern-name">{pattern}:</span>
//               <span className="pattern-score">{score.toFixed(1)}%</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {questionnaireScores && (
//         <div className="result-section">
//           <h3>Questionnaire Scores</h3>
//           <div className="scores-display">
//             {Object.entries(questionnaireScores).map(([pattern, score]) => (
//               <div key={pattern} className="score-item">
//                 <span className="pattern-name">{pattern}:</span>
//                 <span className="pattern-score">{score}%</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {combinedScores && (
//         <div className="result-section">
//           <h3>Combined Analysis</h3>
//           <div className="chart-container">
//             <Bar data={combinedData} />
//           </div>
//           <div className="scores-display">
//             {Object.entries(combinedScores).map(([pattern, score]) => (
//               <div key={pattern} className="score-item">
//                 <span className="pattern-name">{pattern}:</span>
//                 <span className="pattern-score">{score.toFixed(1)}%</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {mImages && mImages.length > 0 && (
//         <div className="m-images-preview">
//           <h3>Extracted M Letters</h3>
//           <div className="image-grid">
//             {mImages.slice(0, 5).map((img, index) => (
//               <div key={index} className="image-item">
//                 <img src={`https://handwritingbackendnode.onrender.com/${img}`} alt={`M ${index + 1}`} />
//                 <p>M {index + 1}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Results;
import React, { useRef } from 'react';
import { Bar, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Download, BarChart3, FileText, TrendingUp } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

const ModernResults = ({ scriptScores, questionnaireScores, combinedScores, mImages }) => {
  const resultsRef = useRef();
  const scriptChartRef = useRef();
  const radarChartRef = useRef();
  const questionnaireChartRef = useRef();

  if (!scriptScores) return null;

  const chartColors = {
    script: {
      background: 'rgba(99, 102, 241, 0.8)',
      border: 'rgb(99, 102, 241)'
    },
    combined: {
      background: 'rgba(16, 185, 129, 0.8)',
      border: 'rgb(16, 185, 129)'
    },
    questionnaire: {
      background: 'rgba(245, 101, 101, 0.8)',
      border: 'rgb(245, 101, 101)'
    }
  };

  const scriptBarData = {
    labels: Object.keys(scriptScores),
    datasets: [
      {
        label: 'Script Analysis',
        data: Object.values(scriptScores),
        backgroundColor: chartColors.script.background,
        borderColor: chartColors.script.border,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false
      }
    ]
  };

  const questionnaireBarData = questionnaireScores ? {
    labels: Object.keys(questionnaireScores),
    datasets: [
      {
        label: 'Questionnaire Scores',
        data: Object.values(questionnaireScores),
        backgroundColor: chartColors.questionnaire.background,
        borderColor: chartColors.questionnaire.border,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false
      }
    ]
  } : null;

  const radarData = combinedScores ? {
    labels: Object.keys(combinedScores),
    datasets: [
      {
        label: 'Script Analysis',
        data: Object.keys(combinedScores).map(key => scriptScores[key] || 0),
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgb(99, 102, 241)',
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(99, 102, 241)',
        borderWidth: 2
      },
      questionnaireScores && {
        label: 'Questionnaire',
        data: Object.keys(combinedScores).map(key => questionnaireScores[key] || 0),
        backgroundColor: 'rgba(245, 101, 101, 0.2)',
        borderColor: 'rgb(245, 101, 101)',
        pointBackgroundColor: 'rgb(245, 101, 101)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(245, 101, 101)',
        borderWidth: 2
      },
      {
        label: 'Combined Analysis',
        data: Object.values(combinedScores),
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgb(16, 185, 129)',
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(16, 185, 129)',
        borderWidth: 2
      }
    ].filter(Boolean)
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.r.toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        pointLabels: {
          font: {
            size: 11
          }
        },
        ticks: {
          callback: function(value) {
            return value + '%';
          },
          font: {
            size: 10
          }
        }
      }
    }
  };

  const generatePDF = async () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Title Page
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Handwriting Analysis Report', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      pdf.text(`Generated on: ${currentDate}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 30;

      // Executive Summary
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Executive Summary', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const scriptAverage = Object.values(scriptScores).reduce((a, b) => a + b, 0) / Object.values(scriptScores).length;
      pdf.text(`• Script Analysis Average: ${scriptAverage.toFixed(1)}%`, 25, yPosition);
      yPosition += 8;

      if (questionnaireScores) {
        const questionnaireAverage = Object.values(questionnaireScores).reduce((a, b) => a + b, 0) / Object.values(questionnaireScores).length;
        pdf.text(`• Questionnaire Average: ${questionnaireAverage.toFixed(1)}%`, 25, yPosition);
        yPosition += 8;
      }

      if (combinedScores) {
        const combinedAverage = Object.values(combinedScores).reduce((a, b) => a + b, 0) / Object.values(combinedScores).length;
        pdf.text(`• Combined Analysis Average: ${combinedAverage.toFixed(1)}%`, 25, yPosition);
        yPosition += 8;
      }

      yPosition += 15;

      // Script Analysis Section
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Script Analysis Results', 20, yPosition);
      yPosition += 15;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      Object.entries(scriptScores).forEach(([pattern, score]) => {
        pdf.text(`${pattern}: ${score.toFixed(1)}%`, 25, yPosition);
        yPosition += 8;
      });
      yPosition += 10;

      // Script Chart
      if (scriptChartRef.current) {
        try {
          const scriptCanvas = await html2canvas(scriptChartRef.current, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
          });
          const scriptImgData = scriptCanvas.toDataURL('image/png');
          const imgWidth = pageWidth - 40;
          const imgHeight = Math.min((scriptCanvas.height * imgWidth) / scriptCanvas.width, 80);
          
          if (yPosition + imgHeight > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          
          pdf.addImage(scriptImgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 15;
        } catch (error) {
          console.warn('Could not add script chart to PDF:', error);
        }
      }

      // Questionnaire Section
      if (questionnaireScores) {
        if (yPosition > pageHeight - 80) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Questionnaire Scores', 20, yPosition);
        yPosition += 15;

        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        Object.entries(questionnaireScores).forEach(([pattern, score]) => {
          pdf.text(`${pattern}: ${score}%`, 25, yPosition);
          yPosition += 8;
        });
        yPosition += 10;

        // Questionnaire Chart
        if (questionnaireChartRef.current) {
          try {
            const questionnaireCanvas = await html2canvas(questionnaireChartRef.current, {
              scale: 2,
              useCORS: true,
              allowTaint: true,
              backgroundColor: '#ffffff'
            });
            const questionnaireImgData = questionnaireCanvas.toDataURL('image/png');
            const imgWidth = pageWidth - 40;
            const imgHeight = Math.min((questionnaireCanvas.height * imgWidth) / questionnaireCanvas.width, 80);
            
            if (yPosition + imgHeight > pageHeight - 20) {
              pdf.addPage();
              yPosition = 20;
            }
            
            pdf.addImage(questionnaireImgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
            yPosition += imgHeight + 15;
          } catch (error) {
            console.warn('Could not add questionnaire chart to PDF:', error);
          }
        }
      }

      // Combined Analysis Section
      if (combinedScores) {
        if (yPosition > pageHeight - 80) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Combined Analysis Results', 20, yPosition);
        yPosition += 15;

        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        Object.entries(combinedScores).forEach(([pattern, score]) => {
          pdf.text(`${pattern}: ${score.toFixed(1)}%`, 25, yPosition);
          yPosition += 8;
        });
        yPosition += 10;

        // Radar Chart
        if (radarChartRef.current) {
          try {
            const radarCanvas = await html2canvas(radarChartRef.current, {
              scale: 2,
              useCORS: true,
              allowTaint: true,
              backgroundColor: '#ffffff'
            });
            const radarImgData = radarCanvas.toDataURL('image/png');
            const imgWidth = pageWidth - 40;
            const imgHeight = Math.min((radarCanvas.height * imgWidth) / radarCanvas.width, 100);
            
            if (yPosition + imgHeight > pageHeight - 20) {
              pdf.addPage();
              yPosition = 20;
            }
            
            pdf.addImage(radarImgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
            yPosition += imgHeight + 15;
          } catch (error) {
            console.warn('Could not add radar chart to PDF:', error);
          }
        }
      }

      // Analysis Insights (New Page)
      pdf.addPage();
      yPosition = 20;

      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Analysis Insights', 20, yPosition);
      yPosition += 15;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      // Find highest and lowest scores
      const allScores = combinedScores || scriptScores;
      const maxScore = Math.max(...Object.values(allScores));
      const minScore = Math.min(...Object.values(allScores));
      const maxPattern = Object.keys(allScores).find(key => allScores[key] === maxScore);
      const minPattern = Object.keys(allScores).find(key => allScores[key] === minScore);

      pdf.text(`• Strongest trait: ${maxPattern} (${maxScore.toFixed(1)}%)`, 25, yPosition);
      yPosition += 8;
      pdf.text(`• Area for development: ${minPattern} (${minScore.toFixed(1)}%)`, 25, yPosition);
      yPosition += 8;
      
      const scoreRange = maxScore - minScore;
      pdf.text(`• Score range: ${scoreRange.toFixed(1)} points`, 25, yPosition);
      yPosition += 15;

      // Recommendations
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Recommendations', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      if (scoreRange > 40) {
        pdf.text('• Consider developing more consistency across different traits', 25, yPosition);
        yPosition += 8;
      }
      if (maxScore > 80) {
        pdf.text('• Leverage your strong traits in professional settings', 25, yPosition);
        yPosition += 8;
      }
      if (minScore < 30) {
        pdf.text('• Focus on developing areas with lower scores', 25, yPosition);
        yPosition += 8;
      }

      // Footer
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'italic');
      pdf.text('This report is generated by AI-powered handwriting analysis', pageWidth / 2, pageHeight - 10, { align: 'center' });

      // Save the PDF
      const filename = `handwriting-analysis-report-${currentDate.replace(/\s/g, '-').replace(/,/g, '')}.pdf`;
      pdf.save(filename);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className="results-section" ref={resultsRef}>
      <div className="results-header">
        <div className="results-title">
          <BarChart3 className="results-icon" />
          <h2>Analysis Results</h2>
        </div>
        <button 
          className="download-pdf-btn" 
          onClick={generatePDF}
        >
          <Download className="button-icon" />
          Download Report
        </button>
      </div>
      
      <div className="results-grid">
        <div className="chart-card">
          <div className="card-header">
            <FileText className="card-icon" />
            <h3>Script Analysis Overview</h3>
          </div>
          <div className="chart-container" ref={scriptChartRef}>
            <Bar data={scriptBarData} options={chartOptions} />
          </div>
          <div className="scores-grid">
            {Object.entries(scriptScores).map(([pattern, score]) => (
              <div key={pattern} className="score-card">
                <span className="score-pattern">{pattern}</span>
                <span className="score-value">{score.toFixed(1)}%</span>
                <div className="score-bar">
                  <div 
                    className="score-fill"
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {questionnaireScores && (
          <div className="chart-card">
            <div className="card-header">
              <TrendingUp className="card-icon" />
              <h3>Questionnaire Scores</h3>
            </div>
            <div className="chart-container" ref={questionnaireChartRef}>
              <Bar data={questionnaireBarData} options={chartOptions} />
            </div>
            <div className="scores-grid">
              {Object.entries(questionnaireScores).map(([pattern, score]) => (
                <div key={pattern} className="score-card questionnaire">
                  <span className="score-pattern">{pattern}</span>
                  <span className="score-value">{score}%</span>
                  <div className="score-bar">
                    <div 
                      className="score-fill questionnaire"
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {combinedScores && (
          <div className="chart-card full-width">
            <div className="card-header">
              <BarChart3 className="card-icon" />
              <h3>Comprehensive Analysis</h3>
            </div>
            <div className="chart-container radar-container" ref={radarChartRef}>
              <Radar data={radarData} options={radarOptions} />
            </div>
            <div className="scores-grid">
              {Object.entries(combinedScores).map(([pattern, score]) => (
                <div key={pattern} className="score-card combined">
                  <span className="score-pattern">{pattern}</span>
                  <span className="score-value">{score.toFixed(1)}%</span>
                  <div className="score-bar">
                    <div 
                      className="score-fill combined"
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {mImages && mImages.length > 0 && (
        <div className="m-images-section">
          <h3>Extracted M Letters</h3>
          <div className="image-grid">
            {mImages.slice(0, 5).map((img, index) => (
              <div key={index} className="image-item">
                <img src={`https://handwriting-backend-239409431927.asia-south1.run.app/${img}`} alt={`M ${index + 1}`} />
                <p>M {index + 1}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;