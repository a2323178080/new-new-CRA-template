import {
  Button,
  Col,
  Descriptions,
  Form,
  Input,
  Row,
  Select,
  Table,
  message,
  InputNumber,
  DatePicker,
  Tooltip,
} from "antd";
import { Content } from 'antd/es/layout/layout';
import { DateSelector, LayoutNav, UploadImage } from "components/layout.component";
import dayjs from 'dayjs';
import { ENABLE, REBATE_PERIOD } from 'enum/state';
import useAccount from 'hooks/account.hook';
import i18n from 'i18n';
import React, { useEffect, useState } from 'react';
import { $get, $post } from 'services';
import {
  convertedToPercentage01 as $g,
  convertedToPercentage02 as $p2n,
  enumToOptions, timeL2S,
  toFormatNumber as $f,
  verify,
} from "utils/common";
import * as common from 'utils/common';
import {  } from 'utils/common';
import { PROMOTION_STATE } from "../../../enum/promotion";
import { DATE_RANGE_LIMIT } from "../../../enum/date";
import { InfoCircleFilled } from "@ant-design/icons";
import { CKEditorComp } from "../../../components/promotion.component";
import { UploadFile } from "antd/lib/upload/interface";
import { useNavigate } from "react-router-dom";
import { useForm } from "antd/lib/form/Form";
import { RESPONSE_CODE_BONUS } from "../../../constants/response";

// 全民代理設置

const PageMain: React.FC = () => {
  const { permissions: $p } = useAccount();
  const [form] = Form.useForm();
  const [isEditDone, setIsEditDone] = useState(false);
  const { data: peopleAgentSettingInfo, isValidating: peopleAgentSettingInfoValidating } = $get({ url: 'api/bonus/peopleagent/info' });

  const onCancel = () => {
    setIsEditDone(false);
  }

  // 返水相關驗證
  const validator: any = async (d: any, val: number, i: number, rateName: string) => {
    const _val: number = Number(val);
    const min: number = 0;
    const max: number = 100;
    // 需大於等於min
    if (_val < min) return Promise.reject(() =>
      <p style={{ margin: 0 }}>{`${i18n.t('mustBeGreaterThanOrEqualTo')}${common.toFormatNumber(min, 0)}`}</p>);
    // 需小於等於max
    else if (_val > max) return Promise.reject(() =>
      <p style={{ margin: 0 }}>{`${i18n.t('mustBeLessThanOrEqualTo')}${common.toFormatNumber(max, 0)}`}</p>);
    else return Promise.resolve();
  }

  const validateOther: any = async (i: number, rateName: string, category: string) => {
    form.validateFields([`${rateName}-${i - 1}`, `${rateName}-${i + 1}`]);
  }
// TODO:暫時拿掉
  // 等級相關驗證
  const levelValidator: any = async (d: any, val: number, i: number, rateName: string, category: string) => {
    // const _val: number = Number(val); // 当前输入的值
    // // 定义所有 level 的顺序
    // const levels = ['level1', 'level2', 'level3', 'level4', 'level5'];
    // // 获取当前 level 在 levels 数组中的索引
    // const currentIndex = levels.indexOf(rateName);
    //
    // // 比较当前值是否小于下一个 level 的值
    // if (currentIndex >= 0 && currentIndex < levels.length - 1) {
    //   const nextLevelName = `${levels[currentIndex + 1]}-${category}`; // 下一个 level 的名字
    //   const nextLevelValue: number = Number(form.getFieldValue(nextLevelName));
    //   // 如果当前值大于等于下一个 level 的值，返回错误
    //   if ((nextLevelValue && nextLevelValue!== 0) && _val >= nextLevelValue) {
    //     return Promise.reject(() => (
    //       <p style={{ margin: 0 }}>
    //         {`${i18n.t('mustBeLessThan')}${nextLevelValue}`}
    //       </p>
    //     ));
    //   }
    // }
    //
    // // 比较当前值是否大于上一个 level 的值
    // if (currentIndex > 0) {
    //   const prevLevelName = `${levels[currentIndex - 1]}-${category}`; // 上一个 level 的名字
    //   const prevLevelValue: number = Number(form.getFieldValue(prevLevelName));
    //   // 如果当前值小于等于上一个 level 的值，返回错误
    //   if ((prevLevelValue && prevLevelValue!== 0) && _val <= prevLevelValue) {
    //     return Promise.reject(() => (
    //       <p style={{ margin: 0 }}>
    //         {`${i18n.t('mustBeGreaterThan')}${prevLevelValue}`}
    //       </p>
    //     ));
    //   }
    // }
    // return Promise.resolve();
  };

  // TODO:暫時拿掉
  const levelValidateOther = async (i: number, rateName: string, category: string) => {
    // const levels = ['level1', 'level2', 'level3', 'level4', 'level5'];
    // // 获取当前 level 的索引
    // const currentIndex = levels.indexOf(rateName);
    // // 构建前一个和下一个 level 的字段名
    // const prevLevelName = currentIndex > 0 ? `${levels[currentIndex - 1]}-${category}` : null;
    // const nextLevelName = currentIndex < levels.length - 1 ? `${levels[currentIndex + 1]}-${category}` : null;
    // form.validateFields([prevLevelName, nextLevelName]);

  };


  const disable = !$p('30602');

  // 控制狀態相關
  const [allStatusDisabled , setAllStatusDisabled] = useState(false);
  const [level2StatusDisabled , setLevel2StatusDisabled] = useState(false);
  const [level3StatusDisabled , setLevel3StatusDisabled] = useState(false);
  const [level4StatusDisabled , setLevel4StatusDisabled] = useState(false);
  const [level5StatusDisabled , setLevel5StatusDisabled] = useState(false);
  const handleAllStatus = (val: any) => {
    setAllStatusDisabled(val === ENABLE.disabled);
  };

  const handleLevel2Status = (val: any) => {
    setLevel2StatusDisabled(val === ENABLE.disabled);
  };

  const handleLevel3Status = (val: any) => {
    setLevel3StatusDisabled(val === ENABLE.disabled);
  };

  const handleLevel4Status = (val: any) => {
    setLevel4StatusDisabled(val === ENABLE.disabled);
  };
  const handleLevel5Status = (val: any) => {
    setLevel5StatusDisabled(val === ENABLE.disabled);
  };

  useEffect(() => {
    if (allStatusDisabled) {
      form.setFieldsValue({
        "level1-IsEnabled" : 0,
        "level2-IsEnabled" : 0,
        "level3-IsEnabled" : 0,
        "level4-IsEnabled" : 0,
        "level5-IsEnabled" : 0
      })
    }
    if(!allStatusDisabled){
      form.setFieldsValue({
        "level1-IsEnabled" : 1,
      })
    }
  }, [allStatusDisabled]);

  useEffect(() => {
    if (level2StatusDisabled) {
      form.setFieldsValue({
        "level3-IsEnabled" : 0,
        "level4-IsEnabled" : 0,
        "level5-IsEnabled" : 0
      })
    }
  }, [level2StatusDisabled]);

  useEffect(() => {
    if (level3StatusDisabled) {
      form.setFieldsValue({
        "level4-IsEnabled" : 0,
        "level5-IsEnabled" : 0
      })
    }
  }, [level3StatusDisabled]);

  useEffect(() => {
    if (level4StatusDisabled) {
      form.setFieldsValue({
        "level5-IsEnabled" : 0
      })
    }
  }, [level4StatusDisabled]);

  useEffect(() => {
    if (peopleAgentSettingInfo?.Data) {
      const level3IsEnabled = form.getFieldValue("level3-IsEnabled");
      const level4IsEnabled = form.getFieldValue("level4-IsEnabled");
      const level5IsEnabled = form.getFieldValue("level5-IsEnabled");
      setLevel3StatusDisabled(level3IsEnabled === 0);
      setLevel4StatusDisabled(level4IsEnabled === 0);
      setLevel5StatusDisabled(level5IsEnabled === 0);
    }
  }, [peopleAgentSettingInfo,form.getFieldValue("level3-IsEnabled"),form.getFieldValue("level4-IsEnabled"),form.getFieldValue("level5-IsEnabled")]);

  // 假資料
  const fakeData = [
    {
      Name: "全民代理等級名稱",
      key: 0
    },
    {
      Name: "全民代理等級名稱",
      key: 1
    },
    {
      Name: "狀態",
      key: 2
    },
    {
      Name: "有效會員條件",
      rule: "應達存款金額",
      key: 3
    },
    {
      Name: "晉級條件",
      rule: "個人累積存款金額",
      key: 4
    },
    {
      Name: "晉級條件",
      rule: "線下直屬會員人數",
      key: 5
    },
    {
      Name: "晉級條件",
      rule: "線下直屬會員累積存款金額",
      key: 6
    },
    {
      Name: "晉級條件",
      rule: "有效直屬會員人數",
      key: 7
    },
  ];
  const fakeData2 = [
    {
      Name: "返水獎勵",
      rule: "洗碼倍率",
      key: 0
    },
    {
      Name: "返水獎勵",
      rule: "遊戲大類 / 返水比例",
      key: 1
    },
    {
      Name: "返水獎勵",
      rule: "老虎機",
      key: 2
    },
    {
      Name: "返水獎勵",
      rule: "真人",
      key: 3
    },
    {
      Name: "返水獎勵",
      rule: "體育",
      key: 4
    },
    {
      Name: "返水獎勵",
      rule: "棋牌",
      key: 5
    },
    {
      Name: "返水獎勵",
      rule: "捕魚機",
      key: 6
    },
    {
      Name: "返水獎勵",
      rule: "彩票",
      key: 7
    },
    {
      Name: "返水獎勵",
      rule: "其他電子",
      key: 8
    },
    {
      Name: "返水獎勵",
      rule: "電競",
      key: 9
    },
    {
      Name: "返水獎勵",
      rule: "鬥雞",
      key: 10
    },
  ];


  const [imageData, setImageData] = useState<UploadFile<any>[]>([]);

  const [loading, setLoading] = useState(false);
  const [editorContent, setEditorContent] = useState<string>();
  const [isPopupValue, setIsPopupValue] = useState(true);

  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);

// 禁用今天之前的所有日期
  const disabledStartDate = (current: any) => {
    return current && current < dayjs().startOf('day');
  };
  // 禁用开始时间之前的日期
  const disabledEndDate = (current: any) => {
    return current && startDate && current < dayjs(startDate).startOf('day');
  };
  // 禁用开始时间之前的时间
  const disabledStartTime = () => {
    const now = dayjs();
    return {
      disabledHours: () => {
        const hours = [];
        for (let i = 0; i < 24; i++) {
          if (i < now.hour()) {
            hours.push(i);
          }
        }
        return hours;
      },
      disabledMinutes: (selectedHour: any) => {
        const minutes = [];
        if (selectedHour === now.hour()) {
          for (let i = 0; i < 60; i++) {
            if (i < now.minute()) {
              minutes.push(i);
            }
          }
        }
        return minutes;
      },
      disabledSeconds: (selectedHour: any, selectedMinute: any) => {
        const seconds = [];
        if (selectedHour === now.hour() && selectedMinute === now.minute()) {
          for (let i = 0; i < 60; i++) {
            if (i < now.second()) {
              seconds.push(i);
            }
          }
        }
        return seconds;
      },
    };
  };
  // 禁用开始时间之前的结束时间
  const disabledEndTime = (endDate: any) => {
    const start = dayjs(startDate);
    return {
      disabledHours: () => {
        const hours = [];
        if (startDate && dayjs(endDate).isSame(start, 'day')) {
          for (let i = 0; i < 24; i++) {
            if (i < start.hour()) {
              hours.push(i);
            }
          }
        }
        return hours;
      },
      disabledMinutes: (selectedHour: any) => {
        const minutes = [];
        if (
          startDate &&
          dayjs(endDate).isSame(start, 'day') &&
          selectedHour === start.hour()
        ) {
          for (let i = 0; i < 60; i++) {
            if (i < start.minute()) {
              minutes.push(i);
            }
          }
        }
        return minutes;
      },
      disabledSeconds: (selectedHour: any, selectedMinute: any) => {
        const seconds = [];
        if (
          startDate &&
          dayjs(endDate).isSame(start, 'day') &&
          selectedHour === start.hour() &&
          selectedMinute === start.minute()
        ) {
          for (let i = 0; i < 60; i++) {
            if (i < start.second()) {
              seconds.push(i);
            }
          }
        }
        return seconds;
      },
    };
  };




  useEffect(() => {
    if (peopleAgentSettingInfo && peopleAgentSettingInfo?.Data ) {
      const { Settings, CommissionMaximun,  CommissionMinimun} = JSON.parse(peopleAgentSettingInfo?.Data?.BonusRuleSetting || '{}');
      const { StartDate, EndDate } = peopleAgentSettingInfo?.Data;
      // 遍历 Settings 以动态设置表单项
      const formValues: any = {
        promotionName: peopleAgentSettingInfo?.Data?.Name,
        CommissionSettleCycle: Number(peopleAgentSettingInfo?.CommissionSettleCycle || 0),
        Status: Number(peopleAgentSettingInfo?.Data?.Status),
        levelSettlementTime: Number(peopleAgentSettingInfo?.CommissionSettleCycle || 0),
        Minimum: CommissionMinimun,
        Maximum: CommissionMaximun,
        distributionMethod: peopleAgentSettingInfo?.Data?.SettleMethod,
        sort: peopleAgentSettingInfo?.Data?.Position,
        StartDate: dayjs(StartDate),
        internalContent: peopleAgentSettingInfo?.Data?.Content
      };

      Settings?.forEach((setting: any, index: any) => {
        formValues[`level${index + 1}-Name`] = setting?.Name;
        formValues[`level${index + 1}-IsEnabled`] = setting?.IsEnabled? 1:0 ;
        formValues[`level${index + 1}-TotalDepositAmount`] = setting?.DirectMembership?.TotalDepositAmount;
        formValues[`level${index + 1}-DirectMemberCount`] = setting?.Membership?.DirectMemberCount;
        formValues[`level${index + 1}-ValidDirectMemberCount`] = setting?.Membership?.ValidDirectMemberCount;
        formValues[`level${index + 1}-TotalPersionalDepositAmount`] = setting?.Membership?.TotalPersionalDepositAmount;
        formValues[`level${index + 1}-TotalDirectMemberDepositAmount`] = setting?.Membership?.TotalDirectMemberDepositAmount;


        formValues[`level${index + 1}-ValidBetTimes`] = setting?.ValidBetTimes;
        formValues[`level${index + 1}-PersionalCommission-SlotCommissionRate`] = $g(setting?.PersionalCommission?.SlotCommissionRate);
        formValues[`level${index + 1}-PersionalCommission-LiveCommissionRate`] = $g(setting?.PersionalCommission?.SlotCommissionRate);
        formValues[`level${index + 1}-PersionalCommission-SportsCommissionRate`] = $g(setting?.PersionalCommission?.SlotCommissionRate);
        formValues[`level${index + 1}-PersionalCommission-PokerCommissionRate`] = $g(setting?.PersionalCommission?.SlotCommissionRate);
        formValues[`level${index + 1}-PersionalCommission-FishingCommissionRate`] = $g(setting?.PersionalCommission?.SlotCommissionRate);
        formValues[`level${index + 1}-PersionalCommission-LotteryCommissionRate`] = $g(setting?.PersionalCommission?.SlotCommissionRate);
        formValues[`level${index + 1}-PersionalCommission-EGamesCommissionRate`] = $g(setting?.PersionalCommission?.SlotCommissionRate);
        formValues[`level${index + 1}-PersionalCommission-ESportsCommissionRate`] = $g(setting?.PersionalCommission?.SlotCommissionRate);
        formValues[`level${index + 1}-PersionalCommission-CockfightCommissionRate`] = $g(setting?.PersionalCommission?.SlotCommissionRate);

        formValues[`level${index + 1}-DirectMemberCommission-SlotCommissionRate`] = $g(setting?.PersionalCommission?.SlotCommissionRate);
        formValues[`level${index + 1}-DirectMemberCommission-LiveCommissionRate`] = $g(setting?.PersionalCommission?.SlotCommissionRate);
        formValues[`level${index + 1}-DirectMemberCommission-SportsCommissionRate`] = $g(setting?.PersionalCommission?.SlotCommissionRate);
        formValues[`level${index + 1}-DirectMemberCommission-PokerCommissionRate`] = $g(setting?.PersionalCommission?.SlotCommissionRate);
        formValues[`level${index + 1}-DirectMemberCommission-FishingCommissionRate`] = $g(setting?.PersionalCommission?.SlotCommissionRate);
        formValues[`level${index + 1}-DirectMemberCommission-LotteryCommissionRate`] = $g(setting?.PersionalCommission?.SlotCommissionRate);
        formValues[`level${index + 1}-DirectMemberCommission-EGamesCommissionRate`] = $g(setting?.PersionalCommission?.SlotCommissionRate);
        formValues[`level${index + 1}-DirectMemberCommission-ESportsCommissionRate`] = $g(setting?.PersionalCommission?.SlotCommissionRate);
        formValues[`level${index + 1}-DirectMemberCommission-CockfightCommissionRate`] = $g(setting?.PersionalCommission?.SlotCommissionRate);

      });

      form.setFieldsValue(formValues);

      setImageData([
        {
          uid: peopleAgentSettingInfo?.Data?.Photo,
          name: peopleAgentSettingInfo?.Data?.Photo,
          url: peopleAgentSettingInfo?.Data?.Photo,
        },
      ])
      setEditorContent(peopleAgentSettingInfo?.Data?.Content);
      if (EndDate === '0000-00-00 00:00:00') {
        form.setFieldValue('EndDate', null);
        setEndDate(null);
      } else {
        form.setFieldValue('EndDate', dayjs(EndDate));
        setEndDate(dayjs(EndDate));
      }
      setStartDate(dayjs(StartDate));
    }
    else{
      form.setFieldsValue({
        // redirectToPromotionPage: 0,
        // oneTimePromotion: 1,
        // applicationMethod: 0,
      })
    }
  }, [peopleAgentSettingInfo]);

  const onFinish = (formData: any) => {
    console.log("轉換前@@", formData[`level1-PersionalCommission-LiveCommissionRate`])
    console.log("轉換後@@", parseFloat($p2n(formData[`level1-PersionalCommission-LiveCommissionRate`])));
    const settings = [];
    const levels = 5; // 假設有5個等級
    for (let i = 1; i <= levels; i++) {
      const setting = {
        Id: i,
        Name: formData[`level${i}-Name`] || null,
        IsEnabled: formData[`level${i}-IsEnabled`] === 1,
        Membership: {
          DirectMemberCount: Number(formData[`level${i}-DirectMemberCount`]) || null,
          ValidDirectMemberCount: Number(formData[`level${i}-ValidDirectMemberCount`]) || null,
          TotalPersionalDepositAmount: Number(formData[`level${i}-TotalPersionalDepositAmount`]) || null,
          TotalDirectMemberDepositAmount: Number(formData[`level${i}-TotalDirectMemberDepositAmount`]) || null
        },
        ValidBetTimes: Number(formData[`level${i}-ValidBetTimes`]) || 1,
        DirectMembership: {
          TotalDepositAmount: Number(formData[`level${i}-TotalDepositAmount`]) || null
        },
        // TODO:施工等待處理問後端
        PersionalCommission: {
          LiveCommissionRate: formData[`level${i}-PersionalCommission-LiveCommissionRate`] || 0,
          SlotCommissionRate: formData[`level${i}-PersionalCommission-SlotCommissionRate`] || 0,
          PokerCommissionRate: formData[`level${i}-PersionalCommission-PokerCommissionRate`] || 0,
          EGamesCommissionRate: formData[`level${i}-PersionalCommission-EGamesCommissionRate`] || 0,
          SportsCommissionRate: formData[`level${i}-PersionalCommission-SportsCommissionRate`] || 0,
          ESportsCommissionRate: formData[`level${i}-PersionalCommission-ESportsCommissionRate`] || 0,
          FishingCommissionRate: formData[`level${i}-PersionalCommission-FishingCommissionRate`] || 0,
          LotteryCommissionRate: formData[`level${i}-PersionalCommission-LotteryCommissionRate`] || 0,
          CockfightCommissionRate: formData[`level${i}-PersionalCommission-CockfightCommissionRate`] || 0
        },
        DirectMemberCommission: {
          LiveCommissionRate: formData[`level${i}-DirectMemberCommission-LiveCommissionRate`] || 0,
          SlotCommissionRate: formData[`level${i}-DirectMemberCommission-SlotCommissionRate`] || 0,
          PokerCommissionRate: formData[`level${i}-DirectMemberCommission-PokerCommissionRate`] || 0,
          EGamesCommissionRate: formData[`level${i}-DirectMemberCommission-EGamesCommissionRate`] || 0,
          SportsCommissionRate: formData[`level${i}-DirectMemberCommission-SportsCommissionRate`] || 0,
          ESportsCommissionRate: formData[`level${i}-DirectMemberCommission-ESportsCommissionRate`] || 0,
          FishingCommissionRate: formData[`level${i}-DirectMemberCommission-FishingCommissionRate`] || 0,
          LotteryCommissionRate: formData[`level${i}-DirectMemberCommission-LotteryCommissionRate`] || 0,
          CockfightCommissionRate: formData[`level${i}-DirectMemberCommission-CockfightCommissionRate`] || 0
        }
      };
      settings.push(setting);
    }

    $post({
      url: 'api/bonus/peopleagent/upsert',
      send: {
        Name: formData.promotionName,
        Status: formData.Status,
        CommissionMinimun:Number(formData.Minimum),
        CommissionMaximun:Number(formData.Maximum),
        SettleMethod: formData.distributionMethod,
        Position: Number(formData.sort),
        StartDate: timeL2S(dayjs(startDate).format('YYYY-MM-DD HH:mm:ss')),
        EndDate: endDate ? timeL2S(dayjs(endDate).format('YYYY-MM-DD HH:mm:ss')) : null,
        Photo: imageData[0] ? [imageData[0].url] : [],
        Content: editorContent,
        Settings: settings
      },
      success: () => {
        message.success(i18n.t('addSuccess'));
      },
      resCode: RESPONSE_CODE_BONUS
    }, setLoading)
  }



  return (
    <div id="container">
      <LayoutNav />
      <Content className="ph-2">
        <Form form={form} component={false} onFinish={onFinish} layout="horizontal" >
          {!disable && (
            <Row gutter={[16, 16]} className="pb-1" >
              {/* 編輯列 */}
              <Col span={24} style={{ display: "flex", justifyContent: "end" }}>
                {
                  isEditDone && <>
                    <Button className="mr-1" onClick={onCancel}>{i18n.t('cancel')}</Button>
                    <Button type="primary" onClick={form.submit}>{i18n.t('confirm')}</Button>
                  </>
                }
                {
                  !isEditDone && $p('50602') &&
                  <Button type="primary" onClick={() => setIsEditDone(!isEditDone)}>{i18n.t('edit')}</Button>
                }
              </Col>
              {/*第一區*/}
              <Col span={24}>
                <Form.Item name="promotionName"
                           label={i18n.t('promotionName')}
                           labelCol={{ span: 24 }}
                           wrapperCol={{ span: 24 }}
                           rules={[{ required: true, message: `${i18n.t('required')}` },
                             { type: 'string', max: 100, message: `${i18n.t('promotionActivityNameLimitedTo100Characters')}` }]} >
                  <Input className="w-24"
                         placeholder={`${i18n.t('inputData')}`}
                         disabled={!isEditDone}
                  />
                </Form.Item>
              </Col>
              {/*第二區*/}
              <Col span={24}>
                <Descriptions layout="vertical" column={6} bordered size="small">
                  {/* 返水週期 */}
                  <Descriptions.Item style={{ width: "16.6%" }}
                                     label={<><span className="require">*</span>{i18n.t("rebatePeriod")}</>}>
                    <Form.Item name="CommissionSettleCycle">
                      <Select
                        style={{ width: "100%" }}
                        disabled
                        options={common.enumToOptions(REBATE_PERIOD)}
                      />
                    </Form.Item>
                  </Descriptions.Item>
                  {/* 全民代理狀態 */}
                  <Descriptions.Item style={{ width: "16.6%" }}
                                     label={<><span className="require">*</span>{`${i18n.t("peopleAgent")}${i18n.t("status")}`}</>}>
                    <Form.Item name="Status">
                      <Select
                        style={{ width: "100%" }}
                        placeholder={`${i18n.t("pleaseSelect")}`}
                        options={common.enumToOptions(ENABLE)}
                        onChange={handleAllStatus}
                        disabled={!isEditDone}
                      />
                    </Form.Item>
                  </Descriptions.Item>
                  {/* 等級結算時間 */}
                  <Descriptions.Item style={{ width: "16.6%" }}
                                     label={<><span className="require">*</span>{`${i18n.t("level")}${i18n.t("settlementTime")}`}</>}>
                    <Form.Item name="levelSettlementTime">
                      <Select
                        style={{ width: "100%" }}
                        disabled
                        options={common.enumToOptions(REBATE_PERIOD)}
                      />
                    </Form.Item>
                  </Descriptions.Item>
                  {/* 返水下限 */}
                  <Descriptions.Item style={{ width: "16.6%" }}
                                     label={<><span className="require">*</span>{i18n.t("minimumRebate")}</>}>
                    <Form.Item name="Minimum"
                               rules={[...verify({ point: 2, min: 0.01, max: 999999999, isShowCompareNumber: true }),
                                 {
                                   validator: (_, value) => {
                                     const maxVal = form.getFieldValue('Maximum');
                                     if (value >= maxVal) {
                                       return Promise.reject(new Error(`${i18n.t("mustBeLessThan")} ${maxVal}`));
                                     }
                                     return Promise.resolve();
                                   },
                                 }
                               ]}>
                      <Input  disabled={!isEditDone || allStatusDisabled}
                              placeholder={`${i18n.t("inputData")}`} />
                    </Form.Item>
                  </Descriptions.Item>
                  {/* 返水上限 */}
                  <Descriptions.Item style={{ width: "16.6%" }}
                                     label={<><span className="require">*</span>{i18n.t("maximumRebate")}</>}>
                    <Form.Item name="Maximum"
                               rules={[...verify({ point: 2, min: 0.01, max: 999999999, isShowCompareNumber: true }),
                                 {
                                   validator: (_, value) => {
                                     const minVal = form.getFieldValue('Minimum');
                                     if (value <= minVal) {
                                       return Promise.reject(new Error(`${i18n.t("mustBeGreaterThan")} ${minVal}`));
                                     }
                                     return Promise.resolve();
                                   },
                                 }
                               ]}>
                      <Input disabled={!isEditDone || allStatusDisabled} placeholder={`${i18n.t("inputData")}`} />
                    </Form.Item>
                  </Descriptions.Item>
                  {/* 派發方式 */}
                  <Descriptions.Item style={{ width: "16.6%" }}
                                     label={<><span className="require">*</span>{i18n.t("distributionMethod")}</>}>
                    <Form.Item name="distributionMethod">
                      <Select
                        style={{ width: "100%" }}
                        placeholder={i18n.t('pleaseSelect')}
                        disabled={!isEditDone || allStatusDisabled}
                        options={[
                          { value: 0, label: `${i18n.t('systemDistribution')}` },
                          { value: 1, label: `${i18n.t('manualDispatch')}` },
                        ]}
                      />
                    </Form.Item>
                  </Descriptions.Item>

                </Descriptions>
              </Col>

              {/*第三區*/}
              <Col className="w-full">
                <Table
                  className="custom-table"
                  showHeader={false}
                  size="small"
                  loading={peopleAgentSettingInfoValidating}
                  bordered
                  dataSource={fakeData}
                  rowClassName={(record) => {
                    return record.key === 0 ? "bg-color-08 " : ""
                  }}
                  columns={[
                    {
                      width: 75,
                      rowScope: 'row',
                      onCell: (_: any, index: any) => {
                        const cellConfig: any = {
                          0: { colSpan: 2, rowSpan: 2 },
                          1: { colSpan: 0, rowSpan: 0 },
                          2: { colSpan: 2 },
                          4: { rowSpan: 4 },
                          5: { rowSpan: 0 },
                          6: { rowSpan: 0 },
                          7: { rowSpan: 0 }
                        };
                        return cellConfig[index] || {};
                      },
                      render: (_, record: any, i: number) => {
                        let textKey;
                        switch (i) {
                          case 0:
                          case 1:
                            textKey = 'peopleAgentLevelName';
                            break;
                          case 2:
                            textKey = 'status';
                            break;
                          case 3:
                            textKey = 'validMembershipConditions';
                            break;
                          case 4:
                          case 5:
                          case 6:
                          case 7:
                            textKey = 'promotionConditions';
                            break;
                          default:
                            return null; // 其他情况返回空或处理其他逻辑
                        }
                        return (
                          <>
                            <span className="require">*</span>{i18n.t(textKey)}
                          </>
                        );
                      }
                    },
                    {
                      width: 75,
                      rowScope: 'row',
                      colSpan: 0,
                      onCell: (_: any, index: any) => {
                        const cellConfig: any = {
                          0: { colSpan: 0 },
                          1: { colSpan: 0 },
                          2: { colSpan: 0 },
                        };
                        return cellConfig[index] || {};
                      },
                      render: (_, record: any, i: number) => {
                        let textKey;
                        switch (i) {
                          case 3:
                            textKey = 'requiredDepositAmount';
                            break;
                          case 4:
                            textKey = 'directMemberCount';
                            break;
                          case 5:
                            textKey = 'validDirectMemberCount';
                            break;
                          case 6:
                            textKey = 'totalPersionalDepositAmount';
                            break;
                          case 7:
                            textKey = 'totalDirectMemberDepositAmount';
                            break;
                          default:
                            return null;
                        }
                        return (
                          <>
                            {i18n.t(textKey)}
                          </>
                        );
                      }
                    },
                    // Level1
                    {
                      width: 150,
                      render: (_, record: any, i: number) => {
                        switch (i) {
                          case 0:
                            return <div>Level 1</div>;
                          case 1:
                            return (
                              <Form.Item
                                name={`level1-Name`}
                                rules={[
                                  { required: true, message: `${i18n.t('required')}` },
                                  {
                                    type: 'string',
                                    max: 10,
                                    message: `${i18n.t('peopleAgentLevelNameLimitedTo10Characters')}`
                                  }
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t('inputData')}`}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 2:
                            return (
                              <Form.Item name={`level1-IsEnabled`}>
                                <Select
                                  disabled
                                  style={{ width: "100%" }}
                                  placeholder={`${i18n.t("pleaseSelect")}`}
                                  options={common.enumToOptions(ENABLE)}
                                />
                              </Form.Item>
                            );
                          case 3:
                            return (
                              <Form.Item
                                name={`level1-TotalDepositAmount`}
                                rules={[...verify({ point: 2 })]}
                              >
                                <Input
                                  disabled={!isEditDone || allStatusDisabled}
                                  placeholder={`${i18n.t("inputData")}`}
                                />
                              </Form.Item>
                            );
                          case 4:
                            return (
                              <Form.Item
                                name={`level1-DirectMemberCount`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => levelValidator(d, val, i, "level1", "DirectMemberCount") }
                                ]}
                              >
                                <Input
                                  disabled={!isEditDone || allStatusDisabled}
                                  placeholder={`${i18n.t("inputData")}`}
                                  onChange={() => levelValidateOther(i, 'level1', "DirectMemberCount")}
                                />
                              </Form.Item>
                            );
                          case 5:
                            return (
                              <Form.Item
                                name={`level1-ValidDirectMemberCount`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => levelValidator(d, val, i, "level1", "ValidDirectMemberCount") }
                                ]}
                              >
                                <Input
                                  disabled={!isEditDone || allStatusDisabled}
                                  placeholder={`${i18n.t("inputData")}`}
                                  onChange={() => levelValidateOther(i, 'level1', "ValidDirectMemberCount")}
                                />
                              </Form.Item>
                            );
                          case 6:
                            return (
                              <Form.Item
                                name={`level1-TotalPersionalDepositAmount`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => levelValidator(d, val, i, "level1", "TotalPersionalDepositAmount") }
                                ]}
                              >
                                <Input
                                  disabled={!isEditDone || allStatusDisabled}
                                  placeholder={`${i18n.t("inputData")}`}
                                  onChange={() => levelValidateOther(i, 'level1', "TotalPersionalDepositAmount")}
                                />
                              </Form.Item>
                            );
                          case 7:
                            return (
                              <Form.Item
                                name={`level1-TotalDirectMemberDepositAmount`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => levelValidator(d, val, i, "level1", "TotalDirectMemberDepositAmount") }
                                ]}
                              >
                                <Input
                                  disabled={!isEditDone || allStatusDisabled}
                                  placeholder={`${i18n.t("inputData")}`}
                                  onChange={() => levelValidateOther(i, 'level1', "TotalDirectMemberDepositAmount")}
                                />
                              </Form.Item>
                            );
                          default:
                            return null;
                        }
                      }
                    },
                    // level2
                    {
                      width: 150,
                      render: (_, record: any, i: number) => {
                        switch (i) {
                          case 0:
                            return <div>Level 2</div>;

                          case 1:
                            return (
                              <Form.Item
                                name={`level2-Name`}
                                rules={[
                                  { required: true, message: `${i18n.t('required')}` },
                                  {
                                    type: 'string',
                                    max: 10,
                                    message: `${i18n.t('peopleAgentLevelNameLimitedTo10Characters')}`
                                  }
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t('inputData')}`}
                                  disabled={!isEditDone || allStatusDisabled || level2StatusDisabled}
                                />
                              </Form.Item>
                            );

                          case 2:
                            return (
                              <Form.Item name={`level2-IsEnabled`}>
                                <Select
                                  style={{ width: "100%" }}
                                  placeholder={`${i18n.t("pleaseSelect")}`}
                                  options={common.enumToOptions(ENABLE)}
                                  disabled={!isEditDone || allStatusDisabled}
                                  onChange={handleLevel2Status}
                                />
                              </Form.Item>
                            );
                          case 3:
                            return (
                              <Form.Item
                                name={`level2-TotalDepositAmount`}
                                rules={[...verify({ point: 2 })]}
                              >
                                <Input
                                  disabled={!isEditDone || allStatusDisabled || level2StatusDisabled}
                                  placeholder={`${i18n.t("inputData")}`}
                                />
                              </Form.Item>
                            );
                          case 4:
                            return (
                              <Form.Item
                                name={`level2-DirectMemberCount`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => levelValidator(d, val, i, "level2", "DirectMemberCount") }
                                ]}
                              >
                                <Input
                                  disabled={!isEditDone || allStatusDisabled || level2StatusDisabled}
                                  placeholder={`${i18n.t("inputData")}`}
                                  onChange={() => levelValidateOther(i, 'level2', "DirectMemberCount")}
                                />
                              </Form.Item>
                            );
                          case 5:
                            return (
                              <Form.Item
                                name={`level2-ValidDirectMemberCount`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => levelValidator(d, val, i, "level2", "ValidDirectMemberCount") }
                                ]}
                              >
                                <Input
                                  disabled={!isEditDone || allStatusDisabled || level2StatusDisabled}
                                  placeholder={`${i18n.t("inputData")}`}
                                  onChange={() => levelValidateOther(i, 'level2', "ValidDirectMemberCount")}
                                />
                              </Form.Item>
                            );
                          case 6:
                            return (
                              <Form.Item
                                name={`level2-TotalPersionalDepositAmount`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => levelValidator(d, val, i, "level2", "TotalPersionalDepositAmount") }
                                ]}
                              >
                                <Input
                                  disabled={!isEditDone || allStatusDisabled || level2StatusDisabled}
                                  placeholder={`${i18n.t("inputData")}`}
                                  onChange={() => levelValidateOther(i, 'level2', "TotalPersionalDepositAmount")}
                                />
                              </Form.Item>
                            );
                          case 7:
                            return (
                              <Form.Item
                                name={`level2-TotalDirectMemberDepositAmount`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => levelValidator(d, val, i, "level2", "TotalDirectMemberDepositAmount") }
                                ]}
                              >
                                <Input
                                  disabled={!isEditDone || allStatusDisabled || level2StatusDisabled}
                                  placeholder={`${i18n.t("inputData")}`}
                                  onChange={() => levelValidateOther(i, 'level2', "TotalDirectMemberDepositAmount")}
                                />
                              </Form.Item>
                            );

                          default:
                            return null;
                        }
                      }
                    },
                    // level3
                    {
                      width: 150,
                      render: (_, record: any, i: number) => {
                        switch (i) {
                          case 0:
                            return <div>Level 3</div>;

                          case 1:
                            return (
                              <Form.Item
                                name={`level3-Name`}
                                rules={[
                                  { required: true, message: `${i18n.t('required')}` },
                                  {
                                    type: 'string',
                                    max: 10,
                                    message: `${i18n.t('peopleAgentLevelNameLimitedTo10Characters')}`
                                  }
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t('inputData')}`}
                                  disabled={!isEditDone || allStatusDisabled || level2StatusDisabled || level3StatusDisabled}
                                />
                              </Form.Item>
                            );

                          case 2:
                            return (
                              <Form.Item name={`level3-IsEnabled`}>
                                <Select
                                  style={{ width: "100%" }}
                                  placeholder={`${i18n.t("pleaseSelect")}`}
                                  options={common.enumToOptions(ENABLE)}
                                  disabled={!isEditDone || allStatusDisabled || level2StatusDisabled }
                                  onChange={handleLevel3Status}
                                />
                              </Form.Item>
                            );

                          case 3:
                            return (
                              <Form.Item
                                name={`level3-TotalDepositAmount`}
                                rules={[...verify({ point: 2 })]}
                              >
                                <Input
                                  disabled={!isEditDone || allStatusDisabled || level2StatusDisabled || level3StatusDisabled}
                                  placeholder={`${i18n.t("inputData")}`}
                                />
                              </Form.Item>
                            );

                          case 4:
                            return (
                              <Form.Item
                                name={`level3-DirectMemberCount`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => levelValidator(d, val, i, "level3", "DirectMemberCount") }
                                ]}
                              >
                                <Input
                                  disabled={!isEditDone || allStatusDisabled || level2StatusDisabled || level3StatusDisabled}
                                  placeholder={`${i18n.t("inputData")}`}
                                  onChange={() => levelValidateOther(i, 'level3', "DirectMemberCount")}
                                />
                              </Form.Item>
                            );

                          case 5:
                            return (
                              <Form.Item
                                name={`level3-ValidDirectMemberCount`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => levelValidator(d, val, i, "level3", "ValidDirectMemberCount") }
                                ]}
                              >
                                <Input
                                  disabled={!isEditDone || allStatusDisabled || level2StatusDisabled || level3StatusDisabled}
                                  placeholder={`${i18n.t("inputData")}`}
                                  onChange={() => levelValidateOther(i, 'level3', "ValidDirectMemberCount")}
                                />
                              </Form.Item>
                            );

                          case 6:
                            return (
                              <Form.Item
                                name={`level3-TotalPersionalDepositAmount`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => levelValidator(d, val, i, "level3", "TotalPersionalDepositAmount") }
                                ]}
                              >
                                <Input
                                  disabled={!isEditDone || allStatusDisabled || level2StatusDisabled || level3StatusDisabled}
                                  placeholder={`${i18n.t("inputData")}`}
                                  onChange={() => levelValidateOther(i, 'level3', "TotalPersionalDepositAmount")}
                                />
                              </Form.Item>
                            );

                          case 7:
                            return (
                              <Form.Item
                                name={`level3-TotalDirectMemberDepositAmount`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => levelValidator(d, val, i, "level3", "TotalDirectMemberDepositAmount") }
                                ]}
                              >
                                <Input
                                  disabled={!isEditDone || allStatusDisabled || level2StatusDisabled || level3StatusDisabled}
                                  placeholder={`${i18n.t("inputData")}`}
                                  onChange={() => levelValidateOther(i, 'level3', "TotalDirectMemberDepositAmount")}
                                />
                              </Form.Item>
                            );

                          default:
                            return null;
                        }
                      }
                    },
                    // level4
                    {
                      width: 150,
                      render: (_, record: any, i: number) => {
                        switch (i) {
                          case 0:
                            return <div>Level 4</div>;

                          case 1:
                            return (
                              <Form.Item
                                name={`level4-Name`}
                                rules={[
                                  { required: true, message: `${i18n.t('required')}` },
                                  {
                                    type: 'string',
                                    max: 10,
                                    message: `${i18n.t('peopleAgentLevelNameLimitedTo10Characters')}`
                                  }
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t('inputData')}`}
                                  disabled={!isEditDone || allStatusDisabled || level2StatusDisabled || level3StatusDisabled || level4StatusDisabled}
                                />
                              </Form.Item>
                            );

                          case 2:
                            return (
                              <Form.Item name={`level4-IsEnabled`}>
                                <Select
                                  style={{ width: "100%" }}
                                  placeholder={`${i18n.t("pleaseSelect")}`}
                                  options={common.enumToOptions(ENABLE)}
                                  onChange={handleLevel4Status}
                                  disabled={!isEditDone || allStatusDisabled || level2StatusDisabled || level3StatusDisabled}
                                />
                              </Form.Item>
                            );

                          case 3:
                            return (
                              <Form.Item
                                name={`level4-TotalDepositAmount`}
                                rules={[...verify({ point: 2 })]}
                              >
                                <Input
                                  disabled={!isEditDone || allStatusDisabled || level2StatusDisabled || level3StatusDisabled || level4StatusDisabled}
                                  placeholder={`${i18n.t("inputData")}`}
                                />
                              </Form.Item>
                            );

                          case 4:
                            return (
                              <Form.Item
                                name={`level4-DirectMemberCount`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => levelValidator(d, val, i, "level4", "DirectMemberCount") }
                                ]}
                              >
                                <Input
                                  disabled={!isEditDone || allStatusDisabled || level2StatusDisabled || level3StatusDisabled || level4StatusDisabled}
                                  placeholder={`${i18n.t("inputData")}`}
                                  onChange={() => levelValidateOther(i, 'level4', "DirectMemberCount")}
                                />
                              </Form.Item>
                            );

                          case 5:
                            return (
                              <Form.Item
                                name={`level4-ValidDirectMemberCount`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => levelValidator(d, val, i, "level4", "ValidDirectMemberCount") }
                                ]}
                              >
                                <Input
                                  disabled={!isEditDone || allStatusDisabled || level2StatusDisabled || level3StatusDisabled || level4StatusDisabled}
                                  placeholder={`${i18n.t("inputData")}`}
                                  onChange={() => levelValidateOther(i, 'level4', "ValidDirectMemberCount")}
                                />
                              </Form.Item>
                            );

                          case 6:
                            return (
                              <Form.Item
                                name={`level4-TotalPersionalDepositAmount`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => levelValidator(d, val, i, "level4", "TotalPersionalDepositAmount") }
                                ]}
                              >
                                <Input
                                  disabled={!isEditDone || allStatusDisabled || level2StatusDisabled || level3StatusDisabled || level4StatusDisabled}
                                  placeholder={`${i18n.t("inputData")}`}
                                  onChange={() => levelValidateOther(i, 'level4', "TotalPersionalDepositAmount")}
                                />
                              </Form.Item>
                            );

                          case 7:
                            return (
                              <Form.Item
                                name={`level4-TotalDirectMemberDepositAmount`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => levelValidator(d, val, i, "level4", "TotalDirectMemberDepositAmount") }
                                ]}
                              >
                                <Input
                                  disabled={!isEditDone || allStatusDisabled || level2StatusDisabled || level3StatusDisabled || level4StatusDisabled}
                                  placeholder={`${i18n.t("inputData")}`}
                                  onChange={() => levelValidateOther(i, 'level4', "TotalDirectMemberDepositAmount")}
                                />
                              </Form.Item>
                            );

                          default:
                            return null;
                        }
                      }
                    },
                    // level5
                    {
                      width: 150,
                      render: (_, record: any, i: number) => {
                        switch (i) {
                          case 0:
                            return <div>Level 5</div>;

                          case 1:
                            return (
                              <Form.Item
                                name={`level5-Name`}
                                rules={[
                                  { required: true, message: `${i18n.t('required')}` },
                                  {
                                    type: 'string',
                                    max: 10,
                                    message: `${i18n.t('peopleAgentLevelNameLimitedTo10Characters')}`
                                  }
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t('inputData')}`}
                                  disabled={!isEditDone || allStatusDisabled || level2StatusDisabled || level3StatusDisabled || level4StatusDisabled || level5StatusDisabled }
                                />
                              </Form.Item>
                            );

                          case 2:
                            return (
                              <Form.Item name={`level5-IsEnabled`}>
                                <Select
                                  style={{ width: "100%" }}
                                  placeholder={`${i18n.t("pleaseSelect")}`}
                                  options={common.enumToOptions(ENABLE)}
                                  onChange={handleLevel5Status}
                                  disabled={!isEditDone || allStatusDisabled || level2StatusDisabled || level3StatusDisabled || level4StatusDisabled }
                                />
                              </Form.Item>
                            );

                          case 3:
                            return (
                              <Form.Item
                                name={`level5-TotalDepositAmount`}
                                rules={[...verify({ point: 2 })]}
                              >
                                <Input
                                  disabled={!isEditDone || allStatusDisabled || level2StatusDisabled || level3StatusDisabled || level4StatusDisabled || level5StatusDisabled}
                                  placeholder={`${i18n.t("inputData")}`}
                                />
                              </Form.Item>
                            );

                          case 4:
                            return (
                              <Form.Item
                                name={`level5-DirectMemberCount`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => levelValidator(d, val, i, "level5", "DirectMemberCount") }
                                ]}
                              >
                                <Input
                                  disabled={!isEditDone || allStatusDisabled || level2StatusDisabled || level3StatusDisabled || level4StatusDisabled || level5StatusDisabled}
                                  placeholder={`${i18n.t("inputData")}`}
                                  onChange={() => levelValidateOther(i, 'level5', "DirectMemberCount")}
                                />
                              </Form.Item>
                            );

                          case 5:
                            return (
                              <Form.Item
                                name={`level5-ValidDirectMemberCount`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => levelValidator(d, val, i, "level5", "ValidDirectMemberCount") }
                                ]}
                              >
                                <Input
                                  disabled={!isEditDone || allStatusDisabled || level2StatusDisabled || level3StatusDisabled || level4StatusDisabled || level5StatusDisabled}
                                  placeholder={`${i18n.t("inputData")}`}
                                  onChange={() => levelValidateOther(i, 'level5', "ValidDirectMemberCount")}
                                />
                              </Form.Item>
                            );

                          case 6:
                            return (
                              <Form.Item
                                name={`level5-TotalPersionalDepositAmount`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => levelValidator(d, val, i, "level5", "TotalPersionalDepositAmount") }
                                ]}
                              >
                                <Input
                                  disabled={!isEditDone || allStatusDisabled || level2StatusDisabled || level3StatusDisabled || level4StatusDisabled || level5StatusDisabled}
                                  placeholder={`${i18n.t("inputData")}`}
                                  onChange={() => levelValidateOther(i, 'level5', "TotalPersionalDepositAmount")}
                                />
                              </Form.Item>
                            );

                          case 7:
                            return (
                              <Form.Item
                                name={`level5-TotalDirectMemberDepositAmount`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => levelValidator(d, val, i, "level5", "TotalDirectMemberDepositAmount") }
                                ]}
                              >
                                <Input
                                  disabled={!isEditDone || allStatusDisabled || level2StatusDisabled || level3StatusDisabled || level4StatusDisabled || level5StatusDisabled}
                                  placeholder={`${i18n.t("inputData")}`}
                                  onChange={() => levelValidateOther(i, 'level5', "TotalDirectMemberDepositAmount")}
                                />
                              </Form.Item>
                            );

                          default:
                            return null;
                        }
                      }
                    }
                  ]}
                  pagination={false}
                />
              </Col>


              {/*第四區*/}
              <Col className="w-full">
                <Table
                  showHeader={false}
                  size="small"
                  loading={peopleAgentSettingInfoValidating}
                  bordered
                  dataSource={fakeData2}
                  columns={[
                    {
                      rowScope:'row',
                      width: 75,
                      onCell: (_, index) => {
                        if (index === 0 ) {
                          return {
                            rowSpan: 11
                          };
                        }
                        return {
                          rowSpan: 0,
                        };
                      },
                      render: (_, record: any, i: number) => {
                        let textKey;
                        switch (i) {
                          case 0:
                          case 1:
                          case 2:
                          case 3:
                          case 4:
                          case 5:
                          case 6:
                          case 7:
                          case 8:
                          case 9:
                          case 10:
                            textKey = 'rebateReward';
                            break;
                          default:
                            return null;
                        }
                        return (
                          <>
                            <span className="require">*</span>{i18n.t(textKey)}
                          </>
                        );
                      }
                    },
                    {
                      rowScope:'row',
                      width: 75,
                      render: (_, record: any, i: number) => {
                        let textKey;
                        switch (i) {
                          case 0:
                            textKey = 'rolloverRate';
                            break;
                          case 1:
                            textKey = 'gameCategoryCashbackProportion';
                            break;
                          case 2:
                            textKey = 'SLOT';
                            break;
                          case 3:
                            textKey = 'LIVE';
                            break;
                          case 4:
                            textKey = 'SPORTS';
                            break;
                          case 5:
                            textKey = 'POKER';
                            break;
                          case 6:
                            textKey = 'FISHING';
                            break;
                          case 7:
                            textKey = 'LOTTERY';
                            break;
                          case 8:
                            textKey = 'EGAMES';
                            break;
                          case 9:
                            textKey = 'ESPORTS';
                            break;
                          case 10:
                            textKey = 'COCKFIGHT';
                            break;
                          default:
                            return null;
                        }
                        return (
                          <>
                            {i18n.t(textKey)}
                          </>
                        );
                      }
                    },
                    // level1返水獎勵
                    {
                      width: 75,
                      onCell: (_, index) => {
                        if (index === 0 ) {
                          return {
                            colSpan: 2
                          };
                        }
                        return {
                        };
                      },
                      render: (_, record: any, i: number) => {
                        switch (i) {
                          case 0:
                            return (
                              <Form.Item
                                name={`level1-ValidBetTimes`}
                                rules={verify({ point: 0 })}
                              >
                                <Input
                                  placeholder={`${i18n.t('inputData')}`}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 1:
                            return <div>{i18n.t("persionalCommission")}</div>;
                          case 2:
                            return (
                              <Form.Item
                                name={`level1-PersionalCommission-SlotCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 3:
                            return (
                              <Form.Item
                                name={`level1-PersionalCommission-LiveCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 4:
                            return (
                              <Form.Item
                                name={`level1-PersionalCommission-SportsCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 5:
                            return (
                              <Form.Item
                                name={`level1-PersionalCommission-PokerCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 6:
                            return (
                              <Form.Item
                                name={`level1-PersionalCommission-FishingCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 7:
                            return (
                              <Form.Item
                                name={`level1-PersionalCommission-LotteryCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 8:
                            return (
                              <Form.Item
                                name={`level1-PersionalCommission-EGamesCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i, "SlotCommissionRate") },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  onChange={() => validateOther(i, "SlotCommissionRate")}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 9:
                            return (
                              <Form.Item
                                name={`level1-PersionalCommission-ESportsCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 10:
                            return (
                              <Form.Item
                                name={`level1-PersionalCommission-CockfightCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          default:
                            return null;
                        }
                      }
                    },
                    {
                      width: 75,
                      onCell: (_, index) => {
                        if (index === 0 ) {
                          return {
                            colSpan: 0
                          };
                        }
                        return {
                        };
                      },
                      render: (_, record: any, i: number) => {
                        switch (i) {
                          case 0:
                            return (
                              <Form.Item
                                name={`level1-ValidBetTimes`}
                                rules={verify({ point: 0 })}
                              >
                                <Input
                                  placeholder={`${i18n.t('inputData')}`}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 1:
                            return (
                              <div>{i18n.t("directMemberCommission")}</div>
                            );
                          case 2:
                            return (
                              <Form.Item
                                name={`level1-DirectMemberCommission-SlotCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 3:
                            return (
                              <Form.Item
                                name={`level1-DirectMemberCommission-LiveCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 4:
                            return (
                              <Form.Item
                                name={`level1-DirectMemberCommission-SportsCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 5:
                            return (
                              <Form.Item
                                name={`level1-DirectMemberCommission-PokerCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 6:
                            return (
                              <Form.Item
                                name={`level1-DirectMemberCommission-FishingCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 7:
                            return (
                              <Form.Item
                                name={`level1-DirectMemberCommission-LotteryCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 8:
                            return (
                              <Form.Item
                                name={`level1-DirectMemberCommission-EGamesCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 9:
                            return (
                              <Form.Item
                                name={`level1-DirectMemberCommission-ESportsCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 10:
                            return (
                              <Form.Item
                                name={`level1-DirectMemberCommission-CockfightCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          default:
                            return null;
                        }
                      }
                    },
                    // level2返水獎勵
                    {
                      width: 75,
                      onCell: (_, index) => {
                        if (index === 0 ) {
                          return {
                            colSpan: 2
                          };
                        }
                        return {
                        };
                      },
                      render: (_, record: any, i: number) => {
                        switch (i) {
                          case 0:
                            return (
                              <Form.Item
                                name={`level2-ValidBetTimes`}
                                rules={verify({ point: 0 })}
                              >
                                <Input
                                  placeholder={`${i18n.t('inputData')}`}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 1:
                            return <div>{i18n.t("persionalCommission")}</div>;
                          case 2:
                            return (
                              <Form.Item
                                name={`level2-PersionalCommission-SlotCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 3:
                            return (
                              <Form.Item
                                name={`level2-PersionalCommission-LiveCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 4:
                            return (
                              <Form.Item
                                name={`level2-PersionalCommission-SportsCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 5:
                            return (
                              <Form.Item
                                name={`level2-PersionalCommission-PokerCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 6:
                            return (
                              <Form.Item
                                name={`level2-PersionalCommission-FishingCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 7:
                            return (
                              <Form.Item
                                name={`level2-PersionalCommission-LotteryCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 8:
                            return (
                              <Form.Item
                                name={`level2-PersionalCommission-EGamesCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i, "SlotCommissionRate") },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  onChange={() => validateOther(i, "SlotCommissionRate")}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 9:
                            return (
                              <Form.Item
                                name={`level2-PersionalCommission-ESportsCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 10:
                            return (
                              <Form.Item
                                name={`level2-PersionalCommission-CockfightCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          default:
                            return null;
                        }
                      }
                    },
                    {
                      width: 75,
                      onCell: (_, index) => {
                        if (index === 0 ) {
                          return {
                            colSpan: 0
                          };
                        }
                        return {
                        };
                      },
                      render: (_, record: any, i: number) => {
                        switch (i) {
                          case 0:
                            return (
                              <Form.Item
                                name={`level2-ValidBetTimes`}
                                rules={verify({ point: 0 })}
                              >
                                <Input
                                  placeholder={`${i18n.t('inputData')}`}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 1:
                            return (
                              <div>{i18n.t("directMemberCommission")}</div>
                            );
                          case 2:
                            return (
                              <Form.Item
                                name={`level2-DirectMemberCommission-SlotCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 3:
                            return (
                              <Form.Item
                                name={`level2-DirectMemberCommission-LiveCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 4:
                            return (
                              <Form.Item
                                name={`level2-DirectMemberCommission-SportsCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 5:
                            return (
                              <Form.Item
                                name={`level2-DirectMemberCommission-PokerCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 6:
                            return (
                              <Form.Item
                                name={`level2-DirectMemberCommission-FishingCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 7:
                            return (
                              <Form.Item
                                name={`level2-DirectMemberCommission-LotteryCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 8:
                            return (
                              <Form.Item
                                name={`level2-DirectMemberCommission-EGamesCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 9:
                            return (
                              <Form.Item
                                name={`level2-DirectMemberCommission-ESportsCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 10:
                            return (
                              <Form.Item
                                name={`level2-DirectMemberCommission-CockfightCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          default:
                            return null;
                        }
                      }
                    },
                    // level3返水獎勵
                    {
                      width: 75,
                      onCell: (_, index) => {
                        if (index === 0 ) {
                          return {
                            colSpan: 2
                          };
                        }
                        return {
                        };
                      },
                      render: (_, record: any, i: number) => {
                        switch (i) {
                          case 0:
                            return (
                              <Form.Item
                                name={`level３-ValidBetTimes`}
                                rules={verify({ point: 0 })}
                              >
                                <Input
                                  placeholder={`${i18n.t('inputData')}`}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 1:
                            return <div>{i18n.t("persionalCommission")}</div>;
                          case 2:
                            return (
                              <Form.Item
                                name={`level3-PersionalCommission-SlotCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 3:
                            return (
                              <Form.Item
                                name={`level3-PersionalCommission-LiveCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 4:
                            return (
                              <Form.Item
                                name={`level3-PersionalCommission-SportsCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 5:
                            return (
                              <Form.Item
                                name={`level3-PersionalCommission-PokerCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 6:
                            return (
                              <Form.Item
                                name={`level3-PersionalCommission-FishingCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 7:
                            return (
                              <Form.Item
                                name={`level3-PersionalCommission-LotteryCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 8:
                            return (
                              <Form.Item
                                name={`level3-PersionalCommission-EGamesCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i, "SlotCommissionRate") },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  onChange={() => validateOther(i, "SlotCommissionRate")}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 9:
                            return (
                              <Form.Item
                                name={`level3-PersionalCommission-ESportsCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 10:
                            return (
                              <Form.Item
                                name={`level3-PersionalCommission-CockfightCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          default:
                            return null;
                        }
                      }
                    },
                    {
                      width: 75,
                      onCell: (_, index) => {
                        if (index === 0 ) {
                          return {
                            colSpan: 0
                          };
                        }
                        return {
                        };
                      },
                      render: (_, record: any, i: number) => {
                        switch (i) {
                          case 0:
                            return (
                              <Form.Item
                                name={`level3-ValidBetTimes`}
                                rules={verify({ point: 0 })}
                              >
                                <Input
                                  placeholder={`${i18n.t('inputData')}`}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 1:
                            return (
                              <div>{i18n.t("directMemberCommission")}</div>
                            );
                          case 2:
                            return (
                              <Form.Item
                                name={`level3-DirectMemberCommission-SlotCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 3:
                            return (
                              <Form.Item
                                name={`level3-DirectMemberCommission-LiveCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 4:
                            return (
                              <Form.Item
                                name={`level3-DirectMemberCommission-SportsCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 5:
                            return (
                              <Form.Item
                                name={`level3-DirectMemberCommission-PokerCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 6:
                            return (
                              <Form.Item
                                name={`level3-DirectMemberCommission-FishingCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 7:
                            return (
                              <Form.Item
                                name={`level3-DirectMemberCommission-LotteryCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 8:
                            return (
                              <Form.Item
                                name={`level3-DirectMemberCommission-EGamesCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 9:
                            return (
                              <Form.Item
                                name={`level3-DirectMemberCommission-ESportsCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 10:
                            return (
                              <Form.Item
                                name={`level3-DirectMemberCommission-CockfightCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          default:
                            return null;
                        }
                      }
                    },
                    // level4返水獎勵
                    {
                      width: 75,
                      onCell: (_, index) => {
                        if (index === 0 ) {
                          return {
                            colSpan: 2
                          };
                        }
                        return {
                        };
                      },
                      render: (_, record: any, i: number) => {
                        switch (i) {
                          case 0:
                            return (
                              <Form.Item
                                name={`level4-ValidBetTimes`}
                                rules={verify({ point: 0 })}
                              >
                                <Input
                                  placeholder={`${i18n.t('inputData')}`}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 1:
                            return <div>{i18n.t("persionalCommission")}</div>;
                          case 2:
                            return (
                              <Form.Item
                                name={`level4-PersionalCommission-SlotCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 3:
                            return (
                              <Form.Item
                                name={`level4-PersionalCommission-LiveCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 4:
                            return (
                              <Form.Item
                                name={`level4-PersionalCommission-SportsCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 5:
                            return (
                              <Form.Item
                                name={`level4-PersionalCommission-PokerCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 6:
                            return (
                              <Form.Item
                                name={`level4-PersionalCommission-FishingCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 7:
                            return (
                              <Form.Item
                                name={`level4-PersionalCommission-LotteryCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 8:
                            return (
                              <Form.Item
                                name={`level4-PersionalCommission-EGamesCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i, "SlotCommissionRate") },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  onChange={() => validateOther(i, "SlotCommissionRate")}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 9:
                            return (
                              <Form.Item
                                name={`level4-PersionalCommission-ESportsCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 10:
                            return (
                              <Form.Item
                                name={`level4-PersionalCommission-CockfightCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          default:
                            return null;
                        }
                      }
                    },
                    {
                      width: 75,
                      onCell: (_, index) => {
                        if (index === 0 ) {
                          return {
                            colSpan: 0
                          };
                        }
                        return {
                        };
                      },
                      render: (_, record: any, i: number) => {
                        switch (i) {
                          case 0:
                            return (
                              <Form.Item
                                name={`level4-ValidBetTimes`}
                                rules={verify({ point: 0 })}
                              >
                                <Input
                                  placeholder={`${i18n.t('inputData')}`}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 1:
                            return (
                              <div>{i18n.t("directMemberCommission")}</div>
                            );
                          case 2:
                            return (
                              <Form.Item
                                name={`level4-DirectMemberCommission-SlotCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 3:
                            return (
                              <Form.Item
                                name={`level4-DirectMemberCommission-LiveCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 4:
                            return (
                              <Form.Item
                                name={`level4-DirectMemberCommission-SportsCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 5:
                            return (
                              <Form.Item
                                name={`level4-DirectMemberCommission-PokerCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 6:
                            return (
                              <Form.Item
                                name={`level4-DirectMemberCommission-FishingCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 7:
                            return (
                              <Form.Item
                                name={`level4-DirectMemberCommission-LotteryCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 8:
                            return (
                              <Form.Item
                                name={`level4-DirectMemberCommission-EGamesCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 9:
                            return (
                              <Form.Item
                                name={`level4-DirectMemberCommission-ESportsCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 10:
                            return (
                              <Form.Item
                                name={`level4-DirectMemberCommission-CockfightCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          default:
                            return null;
                        }
                      }
                    },
                    // level5返水獎勵
                    {
                      width: 75,
                      onCell: (_, index) => {
                        if (index === 0 ) {
                          return {
                            colSpan: 2
                          };
                        }
                        return {
                        };
                      },
                      render: (_, record: any, i: number) => {
                        switch (i) {
                          case 0:
                            return (
                              <Form.Item
                                name={`level5-ValidBetTimes`}
                                rules={verify({ point: 0 })}
                              >
                                <Input
                                  placeholder={`${i18n.t('inputData')}`}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 1:
                            return <div>{i18n.t("persionalCommission")}</div>;
                          case 2:
                            return (
                              <Form.Item
                                name={`level5-PersionalCommission-SlotCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 3:
                            return (
                              <Form.Item
                                name={`level5-PersionalCommission-LiveCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 4:
                            return (
                              <Form.Item
                                name={`level5-PersionalCommission-SportsCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 5:
                            return (
                              <Form.Item
                                name={`level5-PersionalCommission-PokerCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 6:
                            return (
                              <Form.Item
                                name={`level5-PersionalCommission-FishingCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 7:
                            return (
                              <Form.Item
                                name={`level5-PersionalCommission-LotteryCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 8:
                            return (
                              <Form.Item
                                name={`level5-PersionalCommission-EGamesCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i, "SlotCommissionRate") },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  onChange={() => validateOther(i, "SlotCommissionRate")}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 9:
                            return (
                              <Form.Item
                                name={`level5-PersionalCommission-ESportsCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 10:
                            return (
                              <Form.Item
                                name={`level5-PersionalCommission-CockfightCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          default:
                            return null;
                        }
                      }
                    },
                    {
                      width: 75,
                      onCell: (_, index) => {
                        if (index === 0 ) {
                          return {
                            colSpan: 0
                          };
                        }
                        return {
                        };
                      },
                      render: (_, record: any, i: number) => {
                        switch (i) {
                          case 0:
                            return (
                              <Form.Item
                                name={`level5-ValidBetTimes`}
                                rules={verify({ point: 0 })}
                              >
                                <Input
                                  placeholder={`${i18n.t('inputData')}`}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 1:
                            return (
                              <div>{i18n.t("directMemberCommission")}</div>
                            );
                          case 2:
                            return (
                              <Form.Item
                                name={`level5-DirectMemberCommission-SlotCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 3:
                            return (
                              <Form.Item
                                name={`level5-DirectMemberCommission-LiveCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 4:
                            return (
                              <Form.Item
                                name={`level5-DirectMemberCommission-SportsCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 5:
                            return (
                              <Form.Item
                                name={`level5-DirectMemberCommission-PokerCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 6:
                            return (
                              <Form.Item
                                name={`level5-DirectMemberCommission-FishingCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 7:
                            return (
                              <Form.Item
                                name={`level5-DirectMemberCommission-LotteryCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 8:
                            return (
                              <Form.Item
                                name={`level5-DirectMemberCommission-EGamesCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 9:
                            return (
                              <Form.Item
                                name={`level5-DirectMemberCommission-ESportsCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          case 10:
                            return (
                              <Form.Item
                                name={`level5-DirectMemberCommission-CockfightCommissionRate`}
                                rules={[
                                  ...verify({ point: 2 }),
                                  { validator: (d, val) => validator(d, val, i) },
                                ]}
                              >
                                <Input
                                  placeholder={`${i18n.t("inputData")}`}
                                  addonAfter={"%"}
                                  disabled={!isEditDone || allStatusDisabled}
                                />
                              </Form.Item>
                            );
                          default:
                            return null;
                        }
                      }
                    },

                  ]}
                  pagination={false}
                />
              </Col>



              <Col span={24}>
                <Row gutter={[12, 12]} align="middle" justify="start">
                  <Col >
                    <Form.Item name="sort" label={i18n.t('sort')}
                               rules={[...verify({ point: 0 }), { max: 99, type: 'number' }]}
                               labelCol={{ span: 24 }}
                               wrapperCol={{ span: 24 }}
                               className="w-12">
                      <InputNumber className="w-12"
                                   placeholder={`${i18n.t('inputData')}`}
                                   disabled={!isEditDone }
                      />
                    </Form.Item>
                  </Col>
                  <Col >
                    <Form.Item name="StartDate" label={i18n.t('promotionStartTime')}
                               rules={[{ required: true, message: `${i18n.t('required')}` }]}
                               labelCol={{ span: 24 }}
                               wrapperCol={{ span: 24 }}
                               className="w-12">
                      <DatePicker
                        showTime
                        disabledDate={disabledStartDate}
                        disabledTime={disabledStartTime}
                        onChange={(value) => setStartDate(value)}
                        disabled={!isEditDone }
                      />
                    </Form.Item>
                  </Col>
                  <Col >
                    <Form.Item className="w-12" name="EndDate"
                               label={
                                 <Row gutter={6} align="middle">
                                   <Col>{i18n.t('promotionEndTime')}</Col>
                                   <Col>
                                     <Tooltip placement='top'
                                              title={i18n.t('IfTheEndTimeIsNotSetItWillBeRegardedAsAPermanentActivity')}>
                                       <InfoCircleFilled />
                                     </Tooltip>
                                   </Col>
                                 </Row>
                               }>
                      <DatePicker
                        showTime
                        allowClear
                        disabled={!isEditDone || !startDate}
                        disabledDate={disabledEndDate}
                        disabledTime={disabledEndTime}
                        placeholder={`${!endDate && i18n.t('permanent')}`}
                        onChange={(value) => setEndDate(value)}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              {/* 上傳封面圖片 */}
              <Col span={24}>
                <Row>
                  <Col span={24}>
                    <Form.Item name="Photo" label={i18n.t('image')}
                               rules={[{ required: !imageData[0], message: `${i18n.t('uploadImage')}` }]}
                               labelCol={{ span: 24 }}
                               wrapperCol={{ span: 24 }}>
                      <UploadImage
                        name="Photo"
                        url={'/upload/images/public/bonus'}
                        imageData={imageData}
                        setImageData={setImageData}
                        form={form}
                        w={1920}
                        h={560}
                        disabled={!isEditDone }
                      />
                    </Form.Item>
                    <div className="color-03 size-12">
                      {i18n.t('onlyJpgOrPngFiles')}
                      <span className="require">{i18n.t('imageMobileVersionWidth1920pxHeight560px')}</span>
                      {i18n.t('allowedAndSizeNotExceed500kb')}
                    </div>
                  </Col>
                </Row>
              </Col>
              {/* 內文編輯器 */}
              <Col span={24}>
                <Form.Item name="internalContent" label={i18n.t('internalContent')}
                           rules={[{ required: true, message: `${i18n.t('required')}` }]}
                           labelCol={{ span: 24 }}
                           wrapperCol={{ span: 24 }}>
                  <CKEditorComp data={editorContent} setData={setEditorContent} form={form} fieldName={'internalContent'} image disabled={!isEditDone }/>
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>
      </Content>
    </div>
  );
};

export default PageMain;